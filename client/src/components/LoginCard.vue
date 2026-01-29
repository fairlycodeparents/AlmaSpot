<script setup lang="ts">
import { ref, watch } from "vue";
import InputText from "./InputText.vue";
import Button from "./Button.vue";

const props = withDefaults(
  defineProps<{
    minHeight?: string;
    buttonClass?: string;
    isRegister?: boolean;
    apiError?: string | null;
    successMessage?: string | null;
  }>(),
  {
    minHeight: "",
    buttonClass: "w-full",
    isRegister: false,
    apiError: null,
    successMessage: null,
  },
);
const emit = defineEmits([
  "login",
  "signup",
  "toLogin",
  "registerSubmit",
  "clearSuccess",
]);
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const localError = ref("");

watch([email, password, confirmPassword], () => {
  localError.value = "";
  if (props.successMessage) {
    emit("clearSuccess");
  }
});

const handleSubmit = () => {
  localError.value = "";
  emit("clearSuccess");

  if (!email.value || !password.value) {
    localError.value = "Compila tutti i campi obbligatori.";
    return;
  }

  if (props.isRegister) {
    if (!confirmPassword.value) {
      localError.value = "Conferma la tua password.";
      return;
    }
    if (password.value !== confirmPassword.value) {
      localError.value = "Le password non coincidono!";
      return;
    }

    emit("registerSubmit", {
      email: email.value,
      password: password.value,
      confirmPassword: confirmPassword.value,
    });
  } else {
    emit("login", {
      email: email.value,
      password: password.value,
    });
  }
};
</script>

<template>
  <div
    class="bg-base-background rounded-card p-6 w-full shadow-xl flex flex-col gap-5 justify-center"
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

      <InputText
        v-if="isRegister"
        label="Conferma Password"
        placeholder="Reinserisci la tua password"
        type="password"
        v-model="confirmPassword"
      />
    </div>

    <div
      v-if="localError || apiError"
      class="text-brand text-sm font-semibold text-center bg-error-card p-2 rounded-2xl border border-brand"
    >
      {{ localError || apiError }}
    </div>

    <div
      v-if="successMessage"
      class="text-state-success text-sm font-semibold text-center bg-success-card p-2 rounded-2xl border border-state-success"
    >
      {{ successMessage }}
    </div>

    <div class="flex justify-center w-full">
      <Button
        :label="isRegister ? 'Registrati' : 'Accedi'"
        :action="handleSubmit"
        :is-full-width="true"
        :disabled="false"
      />
    </div>

    <div class="flex w-full justify-center items-center gap-1 text-base-text">
      <span>
        {{ isRegister ? "Hai già un account?" : "Non hai un account?" }}
      </span>
      <a
        href="#"
        @click.prevent="isRegister ? $emit('toLogin') : $emit('signup')"
        class="text-base-text underline underline-offset-2 hover:decoration-base-text transition-all"
      >
        {{ isRegister ? "Accedi" : "Registrati" }}
      </a>
    </div>
  </div>
</template>
