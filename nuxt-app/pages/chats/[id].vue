<script setup lang="ts">
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import {
  collection,
  documentId,
  getDocs,
  getFirestore,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";

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
  createdAt: Timestamp;
};

type Message = MessageData & {
  id: string;
};

const route = useRoute();
const room = ref<Room | null>(null);
const messages = ref<Message[]>([]);

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

  const messagesQuery = query(
    collection(db, "rooms", roomDoc.id, "messages"),
    orderBy("createdAt", "asc"),
  );
  const messagesSnapshot = await getDocs(messagesQuery);

  messages.value = messagesSnapshot.docs.map((messageDoc) => ({
    id: messageDoc.id,
    ...(messageDoc.data() as MessageData),
  }));

  console.log(room.value);
  console.log(messages.value);
});

const onSubmit = () => {
  console.log("onsubmit-----");
};
</script>

<template>
  <div class="chat">
    <h2 class="text-xl pt-4 pb-4">{{ room?.name }}</h2>
    <ul>
      <li v-for="message in messages" :key="message.id">
        <!-- TODO: 画像アップロード -->
        <img src="/yama.webp" alt="" />
        <div class="message">
          <span>{{ message.createdAt.toDate() }}</span>
          <p>{{ message.message }}</p>
        </div>
      </li>
    </ul>
  </div>
  <Card class="w-full sm:max-w-md">
    <CardContent>
      <form id="form-vee-demo" @submit="onSubmit">
        <FieldGroup>
          <VeeField v-slot="{ field, errors }" name="title">
            <Field :data-invalid="!!errors.length">
              <FieldLabel for="form-vee-demo-title">
                メッセージを送信する
              </FieldLabel>
              <Input
                id="form-vee-demo-title"
                v-bind="field"
                placeholder="Input Message"
                autocomplete="off"
                :aria-invalid="!!errors.length"
              />
              <FieldError v-if="errors.length" :errors="errors" />
            </Field>
          </VeeField>
        </FieldGroup>
      </form>
    </CardContent>
    <CardFooter>
      <Field orientation="horizontal">
        <Button type="button" variant="outline" @click="resetForm">
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
  width: 50px;
}
.chat ul li .message {
  margin-left: 5px;
}
</style>
