<script setup>
definePageMeta({
  middleware: ['auth'],
});
</script>

<template>
  <UserList/>
</template>