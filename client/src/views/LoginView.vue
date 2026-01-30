<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import LoginCard from "@/components/LoginCard.vue";
import type { LoginDto } from "@/types/api";
import { onMounted, ref } from "vue";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const successMessage = ref("");

onMounted(() => {
  authStore.error = null;
  if (route.query.registered == "true") {
    successMessage.value = "Registrazione avvenuta con successo! Accedi ora.";
  }
});

const handleLogin = async (creds: LoginDto) => {
  successMessage.value = "";

  const success = await authStore.login(creds);
  if (success) {
    await router.replace({ name: "admin-home" });
  }
};

const goToRegister = () => {
  authStore.error = null;
  router.push({ name: "register" });
};
</script>

<template>
  <div class="h-screen bg-brand flex flex-col items-center px-6">
    <header class="flex flex-col items-center text-center px-6 pt-10 pb-6">
      <span class="text-brand-text font-bold text-xl tracking-wide mb-8">
        AlmaSpot
      </span>

      <h1 class="text-4xl font-bold text-brand-text leading-tight">
        Portale Admin
      </h1>
    </header>

    <main
      class="flex-1 flex flex-col justify-center items-center w-full max-w-auth gap-10"
    >
      <LoginCard
        min-height="min-h-[400px]"
        :api-error="authStore.error"
        :success-message="successMessage"
        @login="handleLogin"
        @signup="goToRegister"
        @clear-success="successMessage = ''"
      />

      <p v-if="authStore.isLoading" class="text-brand-text opacity-80">
        Accesso in corso...
      </p>
    </main>

    <div class="h-20"></div>
  </div>
</template>
