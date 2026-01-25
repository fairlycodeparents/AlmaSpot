<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import { useAdminStore } from "@/stores/admin.store";
import AdminActionPanel from "@/components/AdminActionPanel.vue";
import Button from "@/components/Button.vue";

const router = useRouter();
const authStore = useAuthStore();
const adminStore = useAdminStore();
const loadingMessage = ref("Cerco aule libere...");
const handleLogout = () => {
  authStore.logout();
  router.push("/login");
};

const handlePanelSubmit = async (payload: any) => {
  if (payload.mode === "aggiungi") {
    loadingMessage.value = "Cerco aule libere...";
    const found = await adminStore.searchAvailableRooms(payload);
    if (found) {
      router.push("/admin/results");
    } else {
      alert("Errore ricerca: " + adminStore.error);
    }
  } else {
    // TODO
  }
};
</script>

<template>
  <div class="bg-brand h-screen flex flex-col relative overflow-hidden">
    <Button
      label="Esci"
      :action="handleLogout"
      class="absolute top-6 right-6 z-50 bg-base-background! text-brand! hover:bg-ui-card! px-4! py-1! shadow-md text-sm font-bold"
    />

    <header
      class="flex flex-col items-center text-center z-10 px-6 pt-16 pb-24 md:pb-10"
    >
      <span
        class="text-brand-text font-semibold text-lg tracking-wide opacity-90 mb-8"
      >
        AlmaSpot
      </span>

      <h1 class="text-4xl font-bold text-brand-text leading-tight">
        Impostazioni Admin
      </h1>
    </header>

    <main class="w-full flex-1 flex flex-col z-20">
      <AdminActionPanel class="flex-1 w-full" @submit="handlePanelSubmit" />
    </main>
  </div>

  <div
    v-if="adminStore.isLoading"
    class="absolute inset-0 z-60 flex items-center justify-center backdrop-blur-sm"
  >
    <div
      class="bg-brand-text p-6 rounded-2xl shadow-xl flex flex-col items-center gap-3"
    >
      <div
        class="animate-spin rounded-full h-10 w-10 border-4 border-b-ui-border border-t-brand"
      ></div>
      <span class="text-brand font-semibold text-lg">{{ loadingMessage }}</span>
    </div>
  </div>
</template>
