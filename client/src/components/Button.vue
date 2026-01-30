<script setup lang="ts">
export type ButtonVariant = "primary" | "secondary";

export type ButtonConfig = {
  action: () => void;
  label?: string;
  icon?: {
    src: string;
    alt: string;
  };
  isIconRight?: boolean;
  isFullWidth?: boolean;
  variant?: ButtonVariant;
};

const props = withDefaults(defineProps<ButtonConfig>(), {
  isIconRight: true,
  isFullWidth: false,
  variant: "primary",
});

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-brand hover:bg-brand-dark text-brand-text",
  secondary:
    "bg-ui-card hover:bg-gray-300 text-base-text border border-ui-border",
};
</script>

<template>
  <button
    class="flex items-center min-w-10 min-h-10 px-4 py-2 rounded-4xl cursor-pointer transition-colors duration-200 ease-in-out gap-2 shadow-sm active:scale-99"
    :class="[
      variantClasses[props.variant],
      {
        'flex-row-reverse': !isIconRight,
        'justify-center': !icon || !label,
        'justify-between': icon && label,
        'w-full': isFullWidth,
      },
    ]"
    @click="action"
  >
    <span v-if="label">{{ label }}</span>

    <img
      v-if="icon"
      :src="icon.src"
      :alt="icon.alt"
      class="size-auto object-cover rounded-4xl shrink-0"
    />
  </button>
</template>
