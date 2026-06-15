import { onAuthStateChanged, type Auth, type User } from "firebase/auth";

const waitForCurrentUser = (auth: Auth): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

export default defineNuxtRouteMiddleware(async (to) => {
  const user = sessionStorage.getItem("user");
  if (import.meta.server) {
    return navigateTo("/login", { replace: true });
  }

  const { $auth } = useNuxtApp();
  const auth = $auth as Auth | null;
  if (!auth) {
    return navigateTo("/login", { replace: true });
  }

  const currentUser = await waitForCurrentUser(auth);
  if (!currentUser) {
    const redirect = useCookie("redirect");
    redirect.value = to.fullPath;
    return navigateTo("/login", { replace: true });
  }
});
