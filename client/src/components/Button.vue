<script setup lang="ts">
export type ButtonConfig = {
  action: () => void
  label?: string
  icon?: {
    src: string
    alt: string
  }
  isIconRight?: boolean
  isFullWidth?: boolean
}

withDefaults(defineProps<ButtonConfig>(), {
  isIconRight: true,
  isFullWidth: false
})
</script>

<template>
  <button
      class="
      flex items-center justify-between
      max-w-5xl min-w-20 min-h-10
      px-4 py-2
      bg-brand hover:bg-brand-dark text-white
      text-sm font-medium
      rounded-full
      cursor-pointer
      transition-colors duration-200 ease-in-out
      gap-2
      shadow-sm active:scale-99
    "
      :class="{
        'flex-row-reverse': !isIconRight,
        'justify-center': !icon || !label,
        'w-full': isFullWidth
      }"
      @click="action"
  >
    <span v-if="label">{{ label }}</span>

    <img
        v-if="icon"
        :src="icon.src"
        :alt="icon.alt"
        class="size-6 object-cover rounded-full shrink-0"
    />
  </button>
</template>