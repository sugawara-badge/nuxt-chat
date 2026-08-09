import { useAuthStore } from "~/store/auth";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();
  const api = $fetch.create({
    baseURL: config.public.apiUrl,
    onRequest({ options }) {
      const headers = new Headers(options.headers as HeadersInit);
      headers.set("Authorization", `Bearer ${authStore.token}`);
      options.headers = headers;
    },
  });

  return { provide: { api } };
});
