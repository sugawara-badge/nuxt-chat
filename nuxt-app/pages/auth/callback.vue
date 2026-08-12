<!-- TODO: リファクタリングの検討 -->
<script setup>
import { useAuthStore } from "~/store/auth";

const route = useRoute();
const authStore = useAuthStore();
onMounted(() => {
  const token = route.query.token;
  const id = route.query.id;
  const name = route.query.name;
  if (!token) return;
  authStore.updateAuth({ authId: id, displayName: name, token });
  navigateTo("/");
});
</script>
