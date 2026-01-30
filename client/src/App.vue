<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { useStandalone } from "@/composables/useStandalone";
const router = useRouter();
const route = useRoute();
const { isStandalone } = useStandalone();
const goBack = () => {
  if (route.name === "home") return;
  router.back();
};
</script>

<template>
  <button
    v-if="isStandalone && route.name !== 'home'"
    @click="goBack"
    class="fixed top-2 left-2 z-50 p-1 bg-base-background/90 backdrop-blur-sm rounded-full shadow-md hover:scale-105 active:scale-95 flex items-center justify-center"
    aria-label="Torna indietro"
  >
    <img
      src="/icons/chevron_backward.svg"
      class="w-6 h-6"
      alt="Torna indietro"
    />
  </button>
  <router-view></router-view>
</template>
