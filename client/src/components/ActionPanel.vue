<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useTimeSlots } from "@/composables/useTimeSlots";
import { useRouter } from "vue-router";
import { useParameterStore } from "@/stores/parameter.store.ts";
import SegmentedButton from "./SegmentedButton.vue";
import InputText from "./InputText.vue";
import Dropdown from "./Dropdown.vue";
import MyButton from "./Button.vue";
import DurationSelector from "./DurationSelector.vue";

const emit = defineEmits(["submit", "clearSuccess"]);
const parameterStore = useParameterStore();
const router = useRouter();

const errorMessage = ref("");
const AI_ICON_PATH = "icons/ai-icon.svg";

const props = withDefaults(
  defineProps<{
    isAdmin?: boolean;
    apiError?: string | null;
    successMessage?: string | null;
  }>(),
  {
    isAdmin: false,
    apiError: null,
    successMessage: null,
  },
);

const isReady = ref(false);

const mode = ref("aggiungi");
const activityName = ref("");
const campus = ref(parameterStore.selectedCampus || "");
const duration = ref(parameterStore.selectedDuration || 2);
const date = ref(parameterStore.selectedDate || "Oggi");
const dateOptions = ["Oggi", "Domani"];
const modeOptions = [
  { label: "Aggiungi", value: "aggiungi" },
  { label: "Rimuovi", value: "rimuovi" },
];

const { time, availableTimeOptions } = useTimeSlots(date, {
  includeCurrentHour: !props.isAdmin,
});

onMounted(async () => {
  await parameterStore.fetchCampuses();
  if (
    parameterStore.selectedTime &&
    availableTimeOptions.value.includes(parameterStore.selectedTime)
  ) {
    time.value = parameterStore.selectedTime;
  }
  isReady.value = true;
});

const goToAI = () => router.push({ name: "assistant" });
const handleSubmit = () => {
  errorMessage.value = "";
  if (props.isAdmin && mode.value === "aggiungi" && !activityName.value) {
    errorMessage.value = "Inserisci il nome dell'attività.";
    return;
  }
  if (!campus.value || !date.value || !time.value) {
    errorMessage.value = "Compila tutti i campi per procedere.";
    return;
  }
  emit("submit", {
    mode: mode.value,
    activity: activityName.value,
    campus: campus.value,
    date: date.value,
    time: time.value,
    duration: duration.value,
  });
  parameterStore.selectedCampus = campus.value;
  parameterStore.selectedDate = date.value;
  parameterStore.selectedTime = time.value;
  parameterStore.selectedDuration = duration.value;
};

watch([mode, activityName, campus, date, time, duration], () => {
  if (!isReady.value) return;

  errorMessage.value = "";
  if (props.successMessage || props.apiError) {
    emit("clearSuccess");
  }
});
</script>

<template>
  <div
    class="bg-base-background justify-center w-full max-w-5xl rounded-t-4xl p-6 flex flex-col gap-6 shadow-sm"
  >
    <div class="w-full" v-if="props.isAdmin">
      <SegmentedButton
        v-model="mode"
        :options="modeOptions"
        container-class="w-full"
      />
    </div>

    <InputText
      v-if="props.isAdmin && mode === 'aggiungi'"
      required="true"
      label="Nome attività"
      placeholder="Inserisci il nome dell'attività"
      v-model="activityName"
    />

    <Dropdown
      v-model="campus"
      :options="parameterStore.campusOptions"
      :is-full-width="true"
    />

    <div class="flex gap-4">
      <div class="flex-1">
        <Dropdown v-model="date" :options="dateOptions" :is-full-width="true" />
      </div>
      <div class="flex-1">
        <Dropdown
          v-model="time"
          :options="availableTimeOptions"
          :is-full-width="true"
        />
      </div>
    </div>

    <DurationSelector v-model="duration" :min="1" :max="12" class="w-full" />

    <div
      v-if="errorMessage"
      class="text-brand text-sm text-center rounded-xl animate-pulse bg-ui-card p-2"
    >
      {{ errorMessage }}
    </div>
    <div
      v-if="props.successMessage"
      class="text-green-600 text-sm font-semibold text-center bg-ui-card p-2 rounded-xl border border-green-600"
    >
      {{ props.successMessage }}
    </div>

    <div class="flex justify-center w-full">
      <MyButton
        label="Cerca"
        variant="primary"
        :action="handleSubmit"
        :is-full-width="true"
      />
    </div>

    <div class="text-center pt-1 mt-4">
      <button
        v-if="!props.isAdmin"
        type="button"
        @click="goToAI"
        class="text-base-text font-semibold hover:underline flex items-center justify-center gap-2 w-full transition-colors hover:text-brand"
      >
        <img :src="AI_ICON_PATH" alt="AI_ICON" />
        Chiedi un'aula all'AI
      </button>
    </div>

    <footer class="py-6 text-center text-brand text-sm">
      AlmaSpot • Made for students
    </footer>
  </div>
</template>
