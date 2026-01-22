<script setup lang="ts">
import { ref } from "vue";
import InputText from "./InputText.vue";
import Button from "./Button.vue";

withDefaults(
  defineProps<{
    minHeight?: string;
    buttonClass?: string;
  }>(),
  {
    minHeight: "",
    buttonClass: "w-full",
  },
);

const emit = defineEmits(["login", "signup"]);
const email = ref("");
const password = ref("");

const handleSubmit = () => {
  emit("login", { email: email.value, password: password.value });
};
</script>

<template>
  <div
    class="bg-base-background rounded-xl p-8 w-full shadow-xl flex flex-col gap-6 justify-center"
    :class="minHeight"
  >
    <div class="space-y-4">
      <InputText
        label="Email"
        placeholder="Inserisci la tua email istituzionale"
        type="email"
        v-model="email"
      />

      <InputText
        label="Password"
        placeholder="Inserisci la tua password"
        type="password"
        v-model="password"
      />
    </div>

    <div class="flex justify-center w-full">
      <Button label="Accedi" :action="handleSubmit" :is-full-width="true" />
    </div>

    <div
      class="flex w-full justify-center items-center gap-1 text-xs font-medium text-gray-500"
    >
      <span>Non hai un account?</span>
      <a
        href="#"
        @click.prevent="$emit('signup')"
        class="text-base-text underline underline-offset-2 hover:decoration-base-text transition-all"
      >
        Registrati
      </a>
    </div>
  </div>
</template>
