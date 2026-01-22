<script setup lang="ts">
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
    class="flex max-w-87.5 flex-row items-center gap-4 rounded-xl bg-ui-card p-2.5 shadow-md transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-lg"
  >
    <div class="flex-1">
      <h3 class="text-[1.1rem] font-bold text-base-text">
        {{ title }}
      </h3>
      <p class="mt-1 text-sm text-base-text">
        {{ subtitle }}
      </p>
    </div>

    <button
      class="flex w-[20%] items-center justify-center rounded-lg bg-brand p-5 text-white transition-colors duration-200 hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-base-grey"
      @click="buttonAction"
      :aria-label="buttonIcon.includes('delete') ? 'Delete item' : 'Go to item'"
    >
      <img
        :src="buttonIcon"
        alt="Action Icon"
        class="h-6 w-6"
        aria-hidden="true"
      />
    </button>
  </div>
</template>
