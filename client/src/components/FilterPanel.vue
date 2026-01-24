<script setup lang="ts">
import { ref, watch } from "vue";
import Button from "@/components/Button.vue";
import Dropdown from "@/components/Dropdown.vue";

const props = defineProps<{
  isOpen: boolean;
  availableTypes: string[];
  availableSites: string[];
  currentType: string;
  currentSite: string;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "apply", payload: { type: string; site: string }): void;
}>();

const selectedType = ref(props.currentType);
const selectedSite = ref(props.currentSite);

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      selectedType.value = props.currentType;
      selectedSite.value = props.currentSite;
    }
  },
);

const handleConfirm = () => {
  emit("apply", { type: selectedType.value, site: selectedSite.value });
  emit("close");
};
</script>

<template>
  <div>
    <div
      v-if="isOpen"
      class="fixed inset-0 z-40 transition-opacity duration-300"
      @click="$emit('close')"
    ></div>

    <div
      class="fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-[40px] p-8 shadow-[0_-10px_40px_rgba(0,0,0,0.2)] transform transition-transform duration-300 ease-out h-[65vh] flex flex-col"
      :class="isOpen ? 'translate-y-0' : 'translate-y-full'"
    >
      <div
        class="w-16 h-1.5 bg-ui-card rounded-full mx-auto mb-10 shrink-0"
      ></div>

      <div class="flex flex-col gap-8 pb-safe overflow-y-auto flex-1">
        <div class="flex flex-col gap-3">
          <label class="text-base-text font-medium ml-1 text-lg">
            La stanza dev'essere:
          </label>
          <Dropdown
            v-model="selectedType"
            :options="availableTypes"
            :is-full-width="true"
            placeholder="Qualsiasi"
            label="Seleziona tipo stanza"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-base-text font-medium ml-1 text-lg">
            La sede dev'essere in via:
          </label>
          <Dropdown
            v-model="selectedSite"
            :options="availableSites"
            :is-full-width="true"
            placeholder="Qualsiasi"
            label="Seleziona sede"
          />
        </div>

        <div class="mt-auto flex justify-center pb-4">
          <Button
            label="Conferma"
            :action="handleConfirm"
            :is-full-width="true"
          />
        </div>
      </div>
    </div>
  </div>
</template>
