<script setup lang="ts">
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  addDoc,
  collection,
  documentId,
  getDocs,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  where,
} from "firebase/firestore";
import { useAuthStore } from "~/store/auth";
import { getAuth } from "firebase/auth";

import { ref, watch } from "vue";
import { socket } from "~/utils/socket/socket";

const isConnected = ref(false);
const transport = ref("N/A");

if (socket.connected) {
  onConnect();
}

function onConnect() {
  isConnected.value = true;
  transport.value = socket.io.engine.transport.name;
  socket.io.engine.on("upgrade", (rawTransport) => {
    transport.value = rawTransport.name;
  });
}

function onDisconnect() {
  isConnected.value = false;
  transport.value = "N/A";
}

socket.on("connect", onConnect);
socket.on("sampleUpdate", (data: { id: string; lastUpdate: number }) => {
  // コンポーネント側の処理
  console.log("sampleUpdate------");
});

socket.on("message", onMessage);

onBeforeUnmount(() => {
  socket.off("connect", onConnect);
  socket.off("disconnect", onDisconnect);
});

type RoomData = {
  name: string;
  thumbnailUrl: string;
  createdAt: Timestamp;
};

type Room = RoomData & {
  id: string;
};

type Message = {
  id: string;
  message: string;
  name: string;
  photoUrl: string;
  createdAt: Timestamp | string | Date;
};

const toMessageDate = (createdAt: Message["createdAt"]): Date => {
  if (createdAt instanceof Timestamp) {
    return createdAt.toDate();
  }

  if (createdAt instanceof Date) {
    return createdAt;
  }

  if (typeof createdAt === "string" || typeof createdAt === "number") {
    return new Date(createdAt);
  }

  return new Date();
};

const formatMessageTime = (createdAt: Message["createdAt"]): string => {
  const date = toMessageDate(createdAt);

  return (
    `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")} ` +
    `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
  );
};

const route = useRoute();
const authStore = useAuthStore();
const room = ref<Room | null>(null);
const messages = ref<Message[]>([]);
const messageBody = ref("");

const fetchMessages = async (roomId: string) => {
  const db = getFirestore();
  const messagesQuery = query(
    collection(db, "rooms", roomId, "messages"),
    orderBy("createdAt", "asc"),
  );
  const messagesSnapshot = await getDocs(messagesQuery);

  messages.value = messagesSnapshot.docs.map((messageDoc) => ({
    id: messageDoc.id,
    ...(messageDoc.data() as Omit<Message, "id">),
  }));
};

onMounted(async () => {
  const db = getFirestore();
  const q = query(
    collection(db, "rooms"),
    where(documentId(), "==", route.params.id as string),
  );
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return;
  }

  const roomDoc = querySnapshot.docs[0];
  room.value = {
    id: roomDoc.id,
    ...(roomDoc.data() as RoomData),
  };

  await fetchMessages(roomDoc.id);
});

const onSubmit = async () => {
  const text = messageBody.value.trim();
  if (!text || !room.value) {
    return;
  }

  const db = getFirestore();

  try {
    const photoUrl = await loadIcon();
    const createdAt = new Date().toISOString();
    const messageObj = {
      id: crypto.randomUUID(),
      message: text,
      name: authStore.displayName,
      photoUrl,
      createdAt,
    };

    await addDoc(collection(db, "rooms", room.value.id, "messages"), {
      message: text,
      name: authStore.displayName,
      photoUrl,
      createdAt: serverTimestamp(),
    });
    socket.emit("msg", messageObj);
    messages.value.push(messageObj);
    messageBody.value = "";
    // await fetchMessages(room.value.id);
    console.log("メッセージ送信に成功しました。");
  } catch (error) {
    console.error(error);
  }
};

async function onMessage(msg: Message) {
  if (messages.value.some((message) => message.id === msg.id)) {
    return;
  }

  messages.value.push(msg);
}

const loadIcon = async (): Promise<any> => {
  const currentUser = getAuth().currentUser;
  if (!currentUser?.photoURL) {
    return;
  }

  const db = getFirestore();
  const q = query(
    collection(db, "images"),
    where(documentId(), "==", currentUser.photoURL),
  );
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    return;
  }

  return querySnapshot.docs[0].data().imageData as string;
};
</script>

<template>
  <div class="chat">
    <h2 class="text-xl pt-4 pb-4">{{ room?.name }}</h2>
    <ul>
      <li v-for="message in messages" :key="message.id">
        <img :src="message.photoUrl" alt="" />
        <div class="message">
          <span class="message_name">{{ message.name }}</span>

          <span class="message_time">{{ formatMessageTime(message.createdAt) }}</span>

          <p>{{ message.message }}</p>
        </div>
      </li>
    </ul>
  </div>
  <Card class="w-full sm:max-w-md">
    <CardContent>
      <form id="form-vee-demo" @submit.prevent="onSubmit">
        <FieldGroup>
          <Field>
            <FieldLabel for="form-vee-demo-title">
              メッセージを送信する
            </FieldLabel>
            <Input
              id="form-vee-demo-title"
              v-model="messageBody"
              placeholder="Input Message"
              autocomplete="off"
            />
          </Field>
        </FieldGroup>
      </form>
    </CardContent>
    <CardFooter>
      <Field orientation="horizontal">
        <Button type="button" variant="outline" @click="messageBody = ''">
          Reset
        </Button>
        <Button type="submit" form="form-vee-demo"> Submit </Button>
      </Field>
    </CardFooter>
  </Card>
</template>

<style scoped>
.chat ul li {
  display: flex;
  border-bottom: 1px solid #ddd;
  padding-top: 10px;
  padding-bottom: 10px;
}
.chat ul li img {
  max-width: 50px;
}
.chat ul li .message {
  margin-left: 10px;
}
.chat ul li .message .message_name {
  font-size: 16px;
  color: #000;
  font-weight: bold;
}
.chat ul li .message .message_time {
  margin-left: 5px;
}
.chat ul li .message span {
  color: darkgray;
  font-size: 13px;
}
</style>
