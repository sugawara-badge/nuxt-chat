export const useAuthStore = defineStore(
  "auth",
  () => {
    const displayName = ref("");

    // TODO: 型付
    function updateAuth(auth: any) {
      displayName.value = auth.displayName;
    }

    return {
      displayName,
      updateAuth,
    };
  },
  {
    persist: true,
  },
);
