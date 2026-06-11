<script setup lang="ts">
import type { UserWithRole } from "~/types/user";
import { formatDate } from "~/utils/formatDate";

const user = ref<UserWithRole>({
  id: 1,
  name: "テストユーザー",
  email: "test@example.com",
  role: "member",
});

const { greeting } = useGreeting(user.value);
const today = formatDate(new Date());

let message: string = "こんにちは";
console.log("message----");
console.log(message);
</script>

<template>
  <div class="ts-test">
    <h1>TypeScript テスト</h1>
    <p>{{ greeting }}</p>
    <p>メール: {{ user.email }}</p>
    <p>ロール: {{ user.role }}</p>
    <p>今日の日付: {{ today }}</p>
  </div>
</template>

<style scoped>
.ts-test {
  padding: 2rem;
  font-family: system-ui, sans-serif;
}

h1 {
  margin-bottom: 1rem;
}
</style>
