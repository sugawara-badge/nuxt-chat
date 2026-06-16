<script setup>
definePageMeta({
  middleware: ["auth"],
});
</script>

<template>
  <RoomList />
</template>
