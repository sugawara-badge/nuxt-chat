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

import {
  getAuth,
  onAuthStateChanged,
  signOut,
  updateProfile,
} from "firebase/auth";

type RoomData = {
  name: string;
  thumbnailUrl: string;
  createdAt: Timestamp;
};

type Room = RoomData & {
  id: string;
};

type MessageData = {
  message: string;
  name: string;
  photoUrl: string;
  userId: string;
  createdAt: Timestamp;
};

type Message = MessageData & {
  id: string;
};

const route = useRoute();
const authStore = useAuthStore();
const room = ref<Room | null>(null);
const messages = ref<Message[]>([]);
const messageBody = ref("");
const photoURL = ref("");
const userPhotoMap = ref<Record<string, string>>({});

const loadUserPhoto = async (userId: string): Promise<void> => {
  if (userPhotoMap.value[userId]) {
    return;
  }

  const db = getFirestore();
  const q = query(collection(db, "images"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    userPhotoMap.value[userId] = "";
    return;
  }

  const imageData = querySnapshot.docs[0].data().imageData as string;
  userPhotoMap.value[userId] = imageData ?? "";
};

const getUserPhoto = (userId: string): string => {
  return userPhotoMap.value[userId] ?? "";
};

const fetchMessages = async (roomId: string) => {
  const db = getFirestore();
  const messagesQuery = query(
    collection(db, "rooms", roomId, "messages"),
    orderBy("createdAt", "asc"),
  );
  const messagesSnapshot = await getDocs(messagesQuery);

  messages.value = messagesSnapshot.docs.map((messageDoc) => ({
    id: messageDoc.id,
    ...(messageDoc.data() as MessageData),
  }));

  const userIds = [...new Set(messages.value.map((message) => message.userId))];
  await Promise.all(userIds.map((userId) => loadUserPhoto(userId)));
};

onMounted(async () => {
  console.log("userPhotoMap-----", userPhotoMap);

  onAuthStateChanged(getAuth(), (user) => {
    if (user) {
      loadIcon();
      // console.log("hoge-------", hoge);
      // photoURL.value = hoge;
    }
  });

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
    console.log("authStore.authId-------", authStore.authId);

    await addDoc(collection(db, "rooms", room.value.id, "messages"), {
      message: text,
      name: authStore.displayName,
      photoUrl: "/yama.webp",
      userId: authStore.authId,
      createdAt: serverTimestamp(),
    });

    messageBody.value = "";
    await fetchMessages(room.value.id);
    await loadUserPhoto(authStore.authId);
    console.log("メッセージ送信に成功しました。");
  } catch (error) {
    console.error(error);
  }
};

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

  const imageData = querySnapshot.docs[0].data().imageData as string;
  if (imageData) {
    photoURL.value = imageData;
  }
};
</script>

<template>
  <div class="chat">
    <h2 class="text-xl pt-4 pb-4">{{ room?.name }}</h2>
    <ul>
      <li v-for="message in messages" :key="message.id">
        <img :src="getUserPhoto(message.userId)" alt="" />
        <div class="message">
          <span class="message_name">{{ message.name }}</span>
          <span class="message_time">{{ message.createdAt.toDate() }}</span>
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
  max-width: 100px;
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
