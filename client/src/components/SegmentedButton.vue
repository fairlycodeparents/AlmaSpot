<script setup lang="ts">
type Icon = {
  src: string;
  alt: string;
};

export interface SegmentedOption {
  label: string;
  value: string | number;
  action?: () => void;
  icon?: Icon;
}

const props = withDefaults(
  defineProps<{
    modelValue: string | number;
    options: SegmentedOption[];
    containerClass?: string;
  }>(),
  {
    containerClass: "w-full",
  },
);

const emit = defineEmits(["update:modelValue"]);

const select = (option: SegmentedOption) => {
  emit("update:modelValue", option.value);
  if (option.action) {
    option.action();
  }
};
</script>

<template>
  <div
    class="flex border border-ui-border rounded-xl overflow-hidden shadow-sm divide-x divide-ui-border"
    :class="containerClass"
  >
    <button
      v-for="option in props.options"
      :key="option.value"
      @click="select(option)"
      type="button"
      class="flex-1 flex items-center justify-center px-6 py-2.5 text-sm font-medium transition-colors duration-200 ease-in-out gap-2 cursor-pointer focus:outline-none min-w-[80px]"
      :class="[
        modelValue === option.value
          ? 'bg-brand text-brand-text'
          : 'bg-base-background text-base-text hover:bg-ui-card',
      ]"
    >
      <img
        v-if="option.icon && modelValue === option.value"
        :src="option.icon.src"
        :alt="option.icon.alt"
        class="size-4 object-cover rounded-full shrink-0 invert brightness-0"
      />

      <span>{{ option.label }}</span>
    </button>
  </div>
</template>
