<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  ssr: false,
})
</script>

<template>
  <UserList/>
</template>