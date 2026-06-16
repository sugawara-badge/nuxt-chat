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
        {{ message.message }}
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
          <!-- <VeeField v-slot="{ field, errors }" name="description">
            <Field :data-invalid="!!errors.length">
              <FieldLabel for="form-vee-demo-description">
                Description
              </FieldLabel>
              <InputGroup>
                <InputGroupTextarea
                  id="form-vee-demo-description"
                  v-bind="field"
                  placeholder="I'm having an issue with the login button on mobile."
                  :rows="6"
                  class="min-h-24 resize-none"
                  :aria-invalid="!!errors.length"
                />
                <InputGroupAddon align="block-end">
                  <InputGroupText class="tabular-nums">
                    {{ field.value?.length || 0 }}/100 characters
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              <FieldDescription>
                Include steps to reproduce, expected behavior, and what actually
                happened.
              </FieldDescription>
              <FieldError v-if="errors.length" :errors="errors" />
            </Field>
          </VeeField> -->
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
