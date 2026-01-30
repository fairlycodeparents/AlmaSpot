<script setup lang="ts">
import { computed } from "vue";
import { Minus, Plus } from "lucide-vue-next";

interface Props {
  modelValue: number;
  min?: number;
  max?: number;
  step?: number;
}

const props = withDefaults(defineProps<Props>(), {
  min: 1,
  max: 10,
  step: 1,
});

const emit = defineEmits(["update:modelValue"]);

const decrement = () => {
  if (props.modelValue > props.min) {
    emit("update:modelValue", props.modelValue - props.step);
  }
};

const increment = () => {
  if (props.modelValue < props.max) {
    emit("update:modelValue", props.modelValue + props.step);
  }
};

const formattedText = computed(() => {
  return props.modelValue === 1 ? "1 ora" : `${props.modelValue} ore`;
});

const isMin = computed(() => props.modelValue <= props.min);
const isMax = computed(() => props.modelValue >= props.max);
</script>

<template>
  <div
    class="flex items-center justify-between bg-ui-card border border-ui-border rounded-2xl shadow-sm w-full overflow-hidden"
  >
    <button
      @click="decrement"
      :disabled="isMin"
      class="p-3 rounded-2xl cursor-pointer ease-in-out transition-colors duration-200 flex items-center justify-center bg-brand hover:bg-brand-dark text-brand-text"
      :class="isMin ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'"
      aria-label="Diminuisci durata"
    >
      <Minus :size="20" />
    </button>

    <span class="text-base-text select-none min-w-20 text-center">
      {{ formattedText }}
    </span>

    <button
      @click="increment"
      :disabled="isMax"
      class="p-3 rounded-2xl cursor-pointer ease-in-out transition-colors duration-200 flex items-center justify-center bg-brand hover:bg-brand-dark text-brand-text"
      :class="isMax ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'"
      aria-label="Aumenta durata"
    >
      <Plus :size="20" />
    </button>
  </div>
</template>
