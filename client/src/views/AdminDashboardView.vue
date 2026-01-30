<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import { useAdminStore } from "@/stores/admin.store";
import ActionPanel from "@/components/ActionPanel.vue";
import Button from "@/components/Button.vue";
import type { SearchPayload } from "@/types/api";

const router = useRouter();
const authStore = useAuthStore();
const adminStore = useAdminStore();
const loadingMessage = ref("Cerco aule libere...");
const handleLogout = () => {
  authStore.logout();
};

const successMessage = ref("");

onMounted(() => {
  adminStore.error = null;

  const storeMsg = adminStore.consumeSuccessMessage();
  if (storeMsg) {
    successMessage.value = storeMsg;
  }
});

const clearMessages = () => {
  successMessage.value = "";
  adminStore.error = null;
};

const handlePanelSubmit = async (payload: SearchPayload) => {
  clearMessages();
  if (payload.mode === "aggiungi") {
    loadingMessage.value = "Cerco aule libere...";
    const found = await adminStore.searchAvailableRooms(payload);
    if (found) {
      await router.push({ name: "admin-results" });
    }
  } else {
    loadingMessage.value = "Cerco attività...";
    const found = await adminStore.searchActivities(payload);
    if (found) {
      await router.push({ name: "admin-activities" });
    }
  }
};
</script>

<template>
  <div class="h-screen bg-brand flex flex-col relative">
    <Button
      label="Esci"
      :action="handleLogout"
      class="absolute top-6 right-6 z-50 bg-base-background! text-brand! hover:bg-ui-card! px-4! py-1! shadow-md text-sm font-bold"
    />

    <header
      class="flex flex-col items-center text-center px-6 pt-10 pb-10 shrink-0"
    >
      <span class="text-brand-text font-bold text-xl tracking-wide mb-8">
        AlmaSpot
      </span>

      <h1 class="text-4xl font-bold text-brand-text leading-tight">
        Impostazioni Admin
      </h1>
    </header>

    <main class="w-full flex-1 items-center flex flex-col z-20">
      <ActionPanel
        class="flex-1 w-full max-w-app"
        :is-admin="true"
        :api-error="adminStore.error"
        :success-message="successMessage"
        @submit="handlePanelSubmit"
        @clear-success="clearMessages"
      />
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
