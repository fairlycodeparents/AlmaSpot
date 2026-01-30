<script setup lang="ts">
import Button from "@/components/Button.vue";

type CardConfig = {
  title: string;
  subtitle: string;
  buttonIcon: string;
  buttonAction: () => void;
};
defineProps<CardConfig>();
</script>

<template>
  <div
    class="flex max-w-87.5 flex-row items-center gap-4 rounded-2xl bg-ui-card p-2.5 shadow-md transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-lg"
  >
    <div class="flex-1">
      <h3 class="font-bold text-base-text">
        {{ title }}
      </h3>
      <p class="mt-1 text-base-text">
        {{ subtitle }}
      </p>
    </div>
    <Button
      class="flex w-[20%] items-center justify-center"
      :action="buttonAction"
      :icon="{
        src: buttonIcon,
        alt: buttonIcon.includes('delete') ? 'Delete icon' : 'Right arrow icon',
      }"
    />
  </div>
</template>
