<script setup>
const users = [
  {id: 1, name: '1郎'},
  {id: 2, name: '2郎'},
  {id: 3, name: '3郎'},
]
</script>

<template>
  <div class="user-list">
    <h2 class="text-xl pt-4 pb-4">ユーザー一覧</h2>
    <ul>
      <li v-for="user in users" class="">
        <NuxtLink
          :to="{ name: 'chats-id', params: { id: user.id } }"
          class="inline-block p-2"
          >{{ user.name }}</NuxtLink>
        <hr>
      </li>
    </ul>
  </div>
</template>