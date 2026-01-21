<script setup lang="ts">
type Icon = {
  src: string
  alt: string
}

type ButtonConfig = {
  action: () => void
  label?: string
  icon?: Icon
  isIconLeft?: boolean
}

withDefaults(defineProps<ButtonConfig>(), {
  isIconLeft: true
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
      :class="{ 'flex-row-reverse': !isIconLeft, 'justify-center': !icon || !label }"
      @click="action"
  >
    <span v-if="label">{{ label }}</span>

    <img
        v-if="icon"
        :src="icon.src"
        :alt="icon.alt"
        class="size-6 object-cover rounded-full shrink-0"
        :aria-hidden="label ? 'true' : 'false'"
    />
  </button>
</template>