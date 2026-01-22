<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next';

type Option = string | { label: string; value: string | number };

interface Props {
  modelValue: string | number;
  options: Option[];
  placeholder?: string;
  isFullWidth?: boolean;
}

withDefaults(defineProps<Props>(), {
  isFullWidth: true
});

const emit = defineEmits(['update:modelValue']);

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit('update:modelValue', target.value);
};

const getValue = (opt: Option) => (typeof opt === 'object' ? opt.value : opt);
const getLabel = (opt: Option) => (typeof opt === 'object' ? opt.label : opt);
</script>

<template>
  <div
      class="relative group"
      :class="isFullWidth ? 'w-full' : 'w-40'"
  >
    <select
        :value="modelValue"
        @change="handleChange"
        class="
        peer w-full h-12 px-4 pr-10
        appearance-none
        bg-ui-card
        border border-ui-border hover:border-gray-400
        rounded-lg
        text-base-text font-medium
        focus:outline-none focus:ring-1 focus:ring-brand
        transition-all duration-200
        cursor-pointer
      "
        :class="{ 'text-gray-800': !modelValue }"
    >
      <option value="" disabled selected hidden>{{ placeholder || 'Seleziona...' }}</option>

      <option
          v-for="opt in options"
          :key="String(getValue(opt))"
          :value="getValue(opt)"
          class="text-base-text"
      >
        {{ getLabel(opt) }}
      </option>
    </select>

    <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500 peer-focus:rotate-180 transition-all duration-200">
      <ChevronDown :size="20" />
    </div>
  </div>
</template>