<script setup>
import { collection, getFirestore, query, getDocs } from "firebase/firestore";

const users = [
  { id: 1, name: "1郎" },
  { id: 2, name: "2郎" },
  { id: 3, name: "3郎" },
];

onMounted(() => {
  getRooms();
});

const getRooms = async () => {
  const db = getFirestore();
  const q = query(collection(db, "rooms"));
  const querySnapshot = await getDocs(q);
  const users = querySnapshot.docs.map((doc) => {
    console.log(doc.data());
  });
};
</script>

<template>
  <div class="user-list">
    <h2 class="text-xl pt-4 pb-4">ルーム一覧</h2>
    <ul>
      <li v-for="user in users" class="">
        <NuxtLink
          :to="{ name: 'chats-id', params: { id: user.id } }"
          class="inline-block p-2"
          >{{ user.name }}</NuxtLink
        >
        <hr />
      </li>
    </ul>
  </div>
</template>
