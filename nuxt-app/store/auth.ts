export const useAuthStore = defineStore(
  "auth",
  () => {
    const displayName = ref("");

    // TODO: 型付
    function updateAuth(auth: any) {
      displayName.value = auth.displayName;
    }

    function logout() {
      displayName.value = "";
    }

    return {
      displayName,
      updateAuth,
      logout,
    };
  },
  {
    persist: true,
  },
);
