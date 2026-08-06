export const useAuthStore = defineStore(
  "auth",
  () => {
    const authId = ref("");
    const displayName = ref("");
    const displayImage = ref("");
    const token = ref("");

    const count = ref(0);

    function increment() {
      count.value++;
    }

    function updateAuth(auth: {
      authId: string;
      displayName?: string | null;
      displayImage?: string;
      token?: string;
    }) {
      authId.value = auth.authId;
      if (auth.displayName !== undefined) {
        displayName.value = auth.displayName ?? "";
      }
      if (auth.displayImage) displayImage.value = auth.displayImage;
      if (auth.token) token.value = auth.token;
    }

    function logout() {
      authId.value = "";
      displayName.value = "";
      displayImage.value = "";
      token.value = "";
    }

    return {
      authId,
      displayName,
      displayImage,
      token,
      count,
      increment,
      updateAuth,
      logout,
    };
  },
  {
    persist: {
      pick: ["authId", "displayName", "displayImage", "token", "count"],
    },
  },
);
