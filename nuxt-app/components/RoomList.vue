<script setup lang="ts">
import {
  collection,
  getFirestore,
  query,
  getDocs,
  Timestamp,
  orderBy,
} from "firebase/firestore";

type RoomData = {
  name: string;
  thumbnailUrl: string;
  createdAt: Timestamp;
};

type Room = RoomData & {
  id: string;
};

const rooms: Ref<Room[]> = ref([]);

onMounted(() => {
  getRooms();
});

const getRooms = async () => {
  const db = getFirestore();
  const q = query(collection(db, "rooms"), orderBy("createdAt", "asc"));
  const querySnapshot = await getDocs(q);

  rooms.value = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as RoomData),
  }));
};

const createRoom = () => {
  getRooms();
};
</script>

<template>
  <div class="room-list">
    <h2 class="text-xl pt-4 pb-4">ルーム一覧</h2>
    <CreateRoom @createRoomEvent="createRoom" />
    <ul>
      <li v-for="room in rooms" :key="room.id">
        <NuxtLink
          :to="{ name: 'chats-id', params: { id: room.id } }"
          class="inline-block p-2"
        >
          {{ room.name }}
        </NuxtLink>
        <hr />
      </li>
    </ul>
  </div>
</template>
