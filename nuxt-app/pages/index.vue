<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
})
</script>

<template>
  <UserList/>
</template>