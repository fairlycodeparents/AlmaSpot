<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import LoginCard from "@/components/LoginCard.vue";
import type { SignUpDto } from "@/types/api";
import { onMounted } from "vue";

const router = useRouter();
const authStore = useAuthStore();

onMounted(() => {
  authStore.error = null;
});

const goBack = () => {
  authStore.error = null;
  router.push("/login");
};

const handleRegistration = async (formData: SignUpDto) => {
  const payload = {
    email: formData.email,
    password: formData.password,
  };

  const success = await authStore.signUp(payload);

  if (success) {
    router.push({
      name: "login",
      query: { registered: "true" },
    });
  }
};
</script>

<template>
  <div class="h-screen bg-brand flex flex-col items-center px-6">
    <header class="flex flex-col items-center text-center px-6 pt-10 pb-6">
      <span class="text-brand-text font-bold text-xl tracking-wide mb-8">
        AlmaSpot
      </span>

      <h1 class="text-4xl font-bold text-brand-text leading-tight">
        Registrati
      </h1>
    </header>

    <main
      class="flex-1 flex flex-col justify-center items-center w-full max-w-sm gap-10"
    >
      <LoginCard
        min-height="min-h-[400px]"
        :is-register="true"
        :api-error="authStore.error"
        @registerSubmit="handleRegistration"
        @to-login="goBack"
      />

      <div v-if="authStore.isLoading" class="text-white text-sm opacity-80">
        Registrazione in corso...
      </div>
    </main>

    <div class="h-20"></div>
  </div>
</template>
