<script setup lang="ts">
import { Check } from "lucide-vue-next";

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

const props = defineProps<{
  modelValue: string | number;
  options: SegmentedOption[];
}>();

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
    class="inline-flex border border-gray-300 rounded-xl overflow-hidden shadow-sm divide-x divide-gray-200 w-fit"
  >
    <button
      v-for="option in props.options"
      :key="option.value"
      @click="select(option)"
      type="button"
      class="flex items-center justify-center px-6 py-2.5 text-sm font-medium transition-colors duration-200 ease-in-out min-w-[100px] gap-2 cursor-pointer focus:outline-none"
      :class="[
        modelValue === option.value
          ? 'bg-brand text-white'
          : 'bg-white text-gray-600 hover:bg-gray-50',
      ]"
    >
      <img
        v-if="option.icon && modelValue === option.value"
        :src="option.icon.src"
        :alt="option.icon.alt"
        class="size-4 object-cover rounded-full shrink-0"
        :class="[modelValue === option.value ? 'invert brightness-0' : '']"
      />

      <span>{{ option.label }}</span>
    </button>
  </div>
</template>
