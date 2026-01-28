<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useSearchStore } from "../stores/search.store";
import type { SearchPayload } from "@/types/api";
import ActionPanel from "@/components/ActionPanel.vue";

const router = useRouter();
const searchStore = useSearchStore();
const loadingMessage = ref("Cerco aule libere...");

const handleSearch = async (payload: SearchPayload) => {
  loadingMessage.value = "Cerco aule libere...";
  const found = await searchStore.searchRooms(payload);
  if (found) {
    await router.push({ name: "student-results" });
  } else {
    alert("Errore ricerca: " + searchStore.error);
  }
};
const goToLogin = () => router.push({ name: "login" });
</script>

<template>
  <div class="min-h-screen bg-brand flex flex-col relative">
    <div class="absolute top-6 right-6 z-10">
      <button
        type="button"
        @click="goToLogin"
        class="flex items-center gap-2 px-4 py-2"
        title="Admin"
      >
        <img
          src="/icons/profile_login.png"
          alt="Profile Icon"
          class="w-8 h-8"
        />
      </button>
    </div>

    <header class="flex flex-col items-center px-6 pt-16 pb-24 md:pb-10">
      <span
        class="text-brand-text text-center font-semibold text-xl tracking-wide opacity-90 mb-8"
      >
        AlmaSpot
      </span>

      <h1 class="text-4xl font-bold text-left text-brand-text leading-tight">
        Troviamo il tuo prossimo spot.
      </h1>
    </header>

    <main class="w-full items-center justify-center flex-1 flex flex-col z-20">
      <ActionPanel
        class="flex-1 justify-center w-full max-w-5xl"
        :is-admin="false"
        @submit="handleSearch"
      />
    </main>
  </div>

  <div
    v-if="searchStore.isLoading"
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
