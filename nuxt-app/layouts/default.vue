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
import { getAuth, signOut } from "firebase/auth";
import { useAuthStore } from "~/store/auth";

interface StoredUser {
  displayName: string | null;
  email: string | null;
  refreshToken: string;
  uid: string;
}

const auth = ref<StoredUser | null>(null);

onMounted(() => {
  const storedUser = sessionStorage.getItem("user");
  if (storedUser) {
    auth.value = JSON.parse(storedUser) as StoredUser;
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
              >
                <GalleryVerticalEnd class="size-4" />
              </div>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold">{{
                  auth?.displayName
                }}</span>
                <!-- <span class="truncate text-xs">Enterprise</span> -->
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
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
      <footer>footer</footer>
    </SidebarInset>
  </SidebarProvider>
</template>
