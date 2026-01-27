<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import LoginCard from "@/components/LoginCard.vue";
import type { LoginDto } from "@/types/api";

const router = useRouter();
const authStore = useAuthStore();

const handleLogin = async (creds: LoginDto) => {
  const success = await authStore.login(creds);

  if (success) {
    await router.push({ name: "admin-home" });
  } else {
    alert(authStore.error);
  }
};

const goToRegister = () => router.push({ name: "register" });
</script>

<template>
  <div class="min-h-screen bg-brand flex flex-col items-center px-6">
    <header class="flex flex-col items-center text-center px-6 pt-16 pb-24 md:pb-10">
      <span class="text-brand-text font-bold text-xl tracking-wide mb-8">
        AlmaSpot
      </span>

      <h1 class="text-4xl font-bold text-brand-text leading-tight">
        Portale Admin
      </h1>
    </header>

    <main
      class="flex-1 flex flex-col justify-center items-center w-full max-w-sm gap-10"
    >
      <LoginCard
        min-height="min-h-[400px]"
        @login="handleLogin"
        @signup="goToRegister"
      />

      <p v-if="authStore.isLoading" class="text-brand-text opacity-70">
        Accesso in corso...
      </p>
    </main>

    <div class="h-20"></div>
  </div>
</template>
