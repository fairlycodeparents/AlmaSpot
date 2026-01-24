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
      class="fixed inset-0 bg-base-text z-40 transition-opacity duration-300 backdrop-blur-sm"
      @click="$emit('close')"
    ></div>

    <div
      class="fixed bottom-0 left-0 right-0 bg-brand-text z-50 rounded-t-3xl p-6 shadow-2xl transform transition-transform duration-300 ease-out"
      :class="isOpen ? 'translate-y-0' : 'translate-y-full'"
    >
      <div class="w-12 h-1.5 bg-ui-card rounded-full mx-auto mb-6"></div>

      <div class="flex flex-col gap-6 pb-safe">
        <div class="flex flex-col gap-2">
          <label class="text-base-text font-medium ml-1">
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
          <label class="text-base-text font-medium ml-1">
            La sede dev'essere:
          </label>
          <Dropdown
            v-model="selectedSite"
            :options="availableSites"
            :is-full-width="true"
            placeholder="Qualsiasi"
            label="Seleziona sede"
          />
        </div>

        <div class="mt-2 flex justify-center">
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
