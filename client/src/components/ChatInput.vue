<script setup lang="ts">
import { ref, computed } from "vue";
import Button from "./Button.vue";

const props = defineProps<{
  placeholder?: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: "send", text: string): void;
}>();

const message = ref("");
const isInvalid = computed(() => props.disabled || !message.value.trim());

const handleSend = () => {
  if (isInvalid.value) return;
  emit("send", message.value.trim());
  message.value = "";
};
</script>

<template>
  <div
    class="flex items-start w-full p-2 bg-ui-card rounded-4xl border border-transparent focus-within:ring-2 focus-within:ring-brand transition-all"
    :class="{ 'opacity-50 pointer-events-none': disabled }"
  >
    <textarea
      v-model="message"
      :placeholder="placeholder"
      :disabled="disabled"
      aria-label="Input testuale per inviare messaggi"
      rows="1"
      class="block w-full p-2 bg-transparent text-base-text resize-none overflow-y-auto border-none focus:outline-none focus:ring-0 max-h-[4lh] field-sizing-content"
      @keydown.enter.exact.prevent="handleSend"
    />

    <div class="shrink-0 p-2">
      <Button
        :action="handleSend"
        :disabled="isInvalid"
        :is-icon-left="false"
        :icon="{ src: '/icons/arrow-up.svg', alt: 'Invia' }"
      />
    </div>
  </div>
</template>
