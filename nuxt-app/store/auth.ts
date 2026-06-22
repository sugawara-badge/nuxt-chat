export const useAuthStore = defineStore(
  "auth",
  () => {
    const authId = ref("");
    const displayName = ref("");
    const displayImage = ref("");
    const count = ref(0);

    function increment() {
      count.value++;
    }

    function updateAuth(auth: {
      authId: string;
      displayName?: string | null;
      displayImage?: string;
    }) {
      authId.value = auth.authId;
      if (auth.displayName !== undefined) {
        displayName.value = auth.displayName ?? "";
      }
      if (auth.displayImage) displayImage.value = auth.displayImage;
    }

    function logout() {
      displayName.value = "";
      displayImage.value = "";
    }

    return {
      authId,
      displayName,
      displayImage,
      count,
      increment,
      updateAuth,
      logout,
    };
  },
  {
    persist: {
      pick: ["authId", "displayName", "count", "displayImage"],
    },
  },
);
