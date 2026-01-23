<script setup lang="ts">
import { ref } from "vue";
import InputText from "./InputText.vue";
import Button from "./Button.vue";

const props = withDefaults(
  defineProps<{
    minHeight?: string;
    buttonClass?: string;
    isRegister?: boolean;
  }>(),
  {
    minHeight: "",
    buttonClass: "w-full",
    isRegister: false,
  },
);
const emit = defineEmits(["login", "signup", "toLogin", "registerSubmit"]);
const email = ref("");
const password = ref("");
const confirmPassword = ref("");

const handleSubmit = () => {
  if (props.isRegister) {
    if (password.value !== confirmPassword.value) {
      alert("Le password non coincidono!");
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
    class="bg-base-background rounded-2xl p-8 w-full shadow-xl flex flex-col gap-6 justify-center"
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

    <div class="flex justify-center w-full">
      <Button
        :label="isRegister ? 'Registrati' : 'Accedi'"
        :action="handleSubmit"
        :is-full-width="true"
      />
    </div>

    <div
      class="flex w-full justify-center items-center gap-1 text-base-text"
    >
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
