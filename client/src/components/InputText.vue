<script setup lang="ts">
defineProps<{
  modelValue: string;
  label: string;
  placeholder?: string;
  type?: "text" | "password" | "email";
}>();

defineEmits(["update:modelValue"]);
</script>

<template>
  <div class="flex flex-col gap-1.5 w-full">
    <label class="text-base-text">
      {{ label }}
    </label>

    <input
      :type="type || 'text'"
      :value="modelValue"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
      :placeholder="placeholder"
      class="w-full px-4 py-2.5 border rounded-lg bg-base-background text-base-text border-ui-border placeholder-base-grey focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all duration-200"
    />
  </div>
</template>
