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
import type { ChatMessagePayload } from "~/types/chat";

type RoomData = {
  name: string;
  thumbnailUrl: string;
  createdAt: Timestamp;
};

type Room = RoomData & {
  id: string;
};

type Message = ChatMessagePayload;

const route = useRoute();
const authStore = useAuthStore();
const { joinRoom, leaveRoom, sendMessage, onMessage } = useChatSocket();
const room = ref<Room | null>(null);
const messages = ref<Message[]>([]);
const messageBody = ref("");

const toMessage = (messageDoc: {
  id: string;
  data: () => Record<string, unknown>;
}): Message => {
  const data = messageDoc.data();
  const createdAt = data.createdAt as Timestamp;

  return {
    id: messageDoc.id,
    message: String(data.message ?? ""),
    name: String(data.name ?? ""),
    photoUrl: String(data.photoUrl ?? ""),
    createdAt: createdAt?.toDate?.().toISOString() ?? new Date().toISOString(),
  };
};

const appendMessage = (message: Message): void => {
  if (messages.value.some((item) => item.id === message.id)) {
    return;
  }

  messages.value = [...messages.value, message];
};

const formatMessageTime = (createdAt: string): string => {
  const date = new Date(createdAt);

  return (
    `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")} ` +
    `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
  );
};

const fetchMessages = async (roomId: string): Promise<void> => {
  const db = getFirestore();
  const messagesQuery = query(
    collection(db, "rooms", roomId, "messages"),
    orderBy("createdAt", "asc"),
  );
  const messagesSnapshot = await getDocs(messagesQuery);

  messages.value = messagesSnapshot.docs.map((messageDoc) =>
    toMessage(messageDoc),
  );
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
  joinRoom(roomDoc.id);
  onMessage((message) => {
    appendMessage(message);
  });
});

onBeforeUnmount(() => {
  if (room.value) {
    leaveRoom(room.value.id);
  }
});

const loadIcon = async (): Promise<string> => {
  const currentUser = getAuth().currentUser;
  if (!currentUser?.photoURL) {
    return "";
  }

  const db = getFirestore();
  const q = query(
    collection(db, "images"),
    where(documentId(), "==", currentUser.photoURL),
  );
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    return "";
  }

  return (querySnapshot.docs[0].data().imageData as string) ?? "";
};

const onSubmit = async (): Promise<void> => {
  const text = messageBody.value.trim();
  if (!text || !room.value) {
    return;
  }

  const db = getFirestore();

  try {
    const photoUrl = await loadIcon();
    const docRef = await addDoc(
      collection(db, "rooms", room.value.id, "messages"),
      {
        message: text,
        name: authStore.displayName,
        photoUrl,
        createdAt: serverTimestamp(),
      },
    );

    const payload: Message = {
      id: docRef.id,
      message: text,
      name: authStore.displayName,
      photoUrl,
      createdAt: new Date().toISOString(),
    };

    appendMessage(payload);
    sendMessage(room.value.id, payload);
    messageBody.value = "";
  } catch (error) {
    console.error(error);
  }
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
          <span class="message_time">{{
            formatMessageTime(message.createdAt)
          }}</span>
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
