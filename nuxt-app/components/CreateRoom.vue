<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  collection,
  getFirestore,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
const { $constants } = useNuxtApp();

const name = ref("");
const file = ref<File | null>(null);
const imageBase64 = ref<string | null>(null);

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  file.value = target.files?.[0] ?? null;
};

const readFileAsBase64 = (selectedFile: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(selectedFile);
  });
};

const onSubmit = async () => {
  try {
    const db = getFirestore();
    imageBase64.value = file.value
      ? await readFileAsBase64(file.value)
      : $constants.DEFAULT_BASE64;

    addDoc(collection(db, "rooms"), {
      name: name.value,
      thumbnailUrl: imageBase64.value,
      createdAt: serverTimestamp(),
    })
      .then(() => {
        console.log("画像保存に成功しました。");
      })
      .catch((error) => {
        console.error("error-1", error);
      });
  } catch (error) {
    console.error("error-2", error);
  }
};
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button variant="outline">ルーム作成</Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Create Room</DialogTitle>
      </DialogHeader>
      <div class="grid gap-4">
        <div class="grid gap-3">
          <Label for="name-1">Room Name</Label>
          <Input
            v-model="name"
            id="name-1"
            name="name"
            default-value="Pedro Duarte"
          />
        </div>
        <div class="grid w-full max-w-sm items-center gap-1.5">
          <Label for="picture">Picture</Label>
          <Input
            id="picture"
            type="file"
            accept="image/*"
            @change="onFileChange"
          />
        </div>
      </div>
      <DialogFooter>
        <DialogClose as-child>
          <Button variant="outline"> Cancel </Button>
        </DialogClose>
        <Button type="submit" @click="onSubmit"> Save changes </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
