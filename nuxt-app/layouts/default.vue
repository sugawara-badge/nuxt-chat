<script setup lang="ts">
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { GalleryVerticalEnd } from "@lucide/vue";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  updateProfile,
} from "firebase/auth";
import { useAuthStore } from "~/store/auth";

import {
  collection,
  getFirestore,
  addDoc,
  serverTimestamp,
  query,
  getDocs,
  where,
  documentId,
} from "firebase/firestore";

interface StoredUser {
  displayName: string | null;
  email: string | null;
  refreshToken: string;
  uid: string;
  photoURL?: string | null;
}

const auth = ref<StoredUser | null>(null);
const fileInputRef = useTemplateRef<HTMLInputElement>("fileInput");
const photoURL = ref("");
const store = useAuthStore();

onMounted(() => {
  onAuthStateChanged(getAuth(), (user) => {
    if (user) {
      loadIcon();
    }
  });
  const storedUser = sessionStorage.getItem("user");
  if (storedUser) {
    auth.value = JSON.parse(storedUser) as StoredUser;
    if (auth.value.photoURL) {
      photoURL.value = auth.value.photoURL;
    }
  }

  const currentUser = getAuth().currentUser;
  if (currentUser?.photoURL) {
    photoURL.value = currentUser.photoURL;
  }
});

const logOut = (): void => {
  signOut(getAuth()).then(() => {
    sessionStorage.removeItem("user");
    const authStore = useAuthStore();
    authStore.logout();
    navigateTo("/login");
  });
};

const changeIcon = () => {
  fileInputRef.value?.click();
};

const updateIcon = async () => {
  const file = fileInputRef.value?.files?.[0];
  if (!file) {
    return;
  }

  const currentUser = getAuth().currentUser;
  if (!currentUser) {
    return;
  }

  try {
    const base64PhotoURL = await readFileAsBase64(file);
    const db = getFirestore();

    const imageData = await addDoc(collection(db, "images"), {
      userId: currentUser.uid,
      imageData: base64PhotoURL,
      createdAt: serverTimestamp(),
    });
    await updateProfile(currentUser, { photoURL: imageData.id });

    store.updateAuth({
      displayName: currentUser.displayName,
      displayImage: imageData.id,
    });
  } catch (error) {
    console.error(error);
  } finally {
    if (fileInputRef.value) {
      fileInputRef.value.value = "";
    }
    loadIcon();
  }
};

const loadIcon = async (): Promise<void> => {
  const currentUser = getAuth().currentUser;
  if (!currentUser?.photoURL) {
    return;
  }

  const db = getFirestore();
  const q = query(
    collection(db, "images"),
    where(documentId(), "==", currentUser.photoURL),
  );

  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    return;
  }

  const imageData = querySnapshot.docs[0].data().imageData as string;
  if (imageData) {
    photoURL.value = imageData;
  }
};

const readFileAsBase64 = (selectedFile: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(selectedFile);
  });
};
</script>

<template>
  <!-- TODO: 表示制御 -->
  <SidebarProvider v-if="true">
    <Sidebar v-if="true">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div
                class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
                @click="changeIcon"
              >
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="updateIcon"
                />
                <img :src="photoURL" alt="" />
              </div>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold">{{
                  auth?.displayName
                }}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <!-- <SidebarGroupLabel>Platform</SidebarGroupLabel> -->
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton as-child>
                  <NuxtLink to="/">Home</NuxtLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton as-child>
                  <NuxtLink @click="logOut">Logout</NuxtLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
      <SidebarRail />
    </Sidebar>
    <SidebarInset>
      <header
        class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
      >
        <div class="flex items-center gap-2 px-4">
          <SidebarTrigger class="-ml-1" />
        </div>
      </header>

      <div class="flex flex-1 flex-col gap-4 p-4 pt-0 fugafugafugafugafuga">
        <!-- <div class="grid auto-rows-min gap-4 md:grid-cols-3">
          <div class="aspect-video rounded-xl bg-muted/50" />
          <div class="aspect-video rounded-xl bg-muted/50" />
          <div class="aspect-video rounded-xl bg-muted/50" />
        </div>
        <div class="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" /> -->
        <slot />
      </div>
    </SidebarInset>
  </SidebarProvider>
  <Footer />
</template>
