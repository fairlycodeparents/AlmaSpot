<script setup lang="ts">
type ButtonConfig = {
  action: () => void
  label?: string
  icon?: string
}

defineProps<ButtonConfig>()
</script>

<template>
  <button
      class="
      flex items-center justify-between
      max-w-5xl min-h-10
      px-4 py-2
      bg-brand hover:bg-brand-dark text-white
      text-sm font-medium
      rounded-full
      cursor-pointer
      transition-colors duration-200 ease-in-out
      gap-2
      shadow-sm active:scale-99
    "
      @click="action"
  >
    <span v-if="label">{{ label }}</span>

    <img
        v-if="icon"
        :src="icon"
        alt="${label} icon"
        class="size-6 object-cover rounded-full shrink-0"
        aria-hidden="true"
    />
  </button>
</template>