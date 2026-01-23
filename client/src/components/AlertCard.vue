<script setup lang="ts">
interface AlertConfig {
  title?: string;
  intro?: string;
  message: string;
  timeSlot?: string;
}

withDefaults(defineProps<AlertConfig>(), {
  title: "Attenzione!",
  intro: "",
  message: "",
  timeSlot: "",
});
</script>

<template>
  <div
    class="bg-accent text-base-text rounded-4xl p-8 shadow-lg max-w-md w-full"
    role="alert"
  >
    <h2 class="text-4xl font-bold mb-3 tracking-tight">
      {{ title }}
    </h2>

    <div class="leading-snug space-y-1">
      <p class="opacity-90">{{ intro }}</p>
      <p>
        {{ message }} <span v-if="timeSlot">{{ timeSlot }} </span>
      </p>
    </div>
  </div>
</template>
