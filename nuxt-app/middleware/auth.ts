// import { onAuthStateChanged, type Auth, type User } from "firebase/auth";
import { useAuthStore } from "~/store/auth";

// const waitForCurrentUser = (auth: Auth): Promise<User | null> => {
//   return new Promise((resolve) => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       unsubscribe();
//       resolve(user);
//     });
//   });
// };

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore();
  if (!auth.displayName) {
    return navigateTo("/login", { replace: true });
  }
  return;
});
