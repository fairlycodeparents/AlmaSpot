<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
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
const dateOptions = computed(() => {
  const now = new Date();
  const currentHour = now.getHours();

  if (currentHour >= 18) {
    return ["Domani"];
  }

  return ["Oggi", "Domani"];
});
const modeOptions = [
  { label: "Aggiungi", value: "aggiungi" },
  { label: "Rimuovi", value: "rimuovi" },
];

const { time, availableTimeOptions } = useTimeSlots(date, {
  includeCurrentHour: !props.isAdmin,
});

onMounted(async () => {
  await parameterStore.fetchCampuses();

  if (!dateOptions.value.includes(date.value)) {
    date.value = "Domani";
  }

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

  const [startHour] = time.value.split(":").map(Number);
  const endHour = startHour! + duration.value;

  if (endHour > 19) {
    errorMessage.value = `L'orario finale (${endHour}:00) supera la chiusura dell'ateneo (19:00). Riduci la durata o cambia orario.`;
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
    class="bg-base-background justify-start w-full max-w-app rounded-t-sheet p-5 flex flex-col gap-4 shadow-sm"
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

    <DurationSelector v-model="duration" :min="1" :max="10" class="w-full" />

    <div class="w-full flex items-center justify-center shrink-0 my-1">
      <div
        v-if="errorMessage"
        class="text-brand text-xs font-semibold text-center rounded-2xl bg-error-card py-2 px-3 w-full border border-brand shadow-sm"
      >
        {{ errorMessage }}
      </div>

      <div
        v-else-if="props.successMessage"
        class="text-state-success text-xs font-semibold text-center bg-success-card py-2 px-3 rounded-2xl border border-state-success w-full shadow-sm"
      >
        {{ props.successMessage }}
      </div>
    </div>

    <MyButton
      label="Cerca"
      variant="primary"
      :action="handleSubmit"
      :is-full-width="true"
    />

    <MyButton
      label="Chiedi all'AI"
      variant="secondary"
      :action="goToAI"
      :icon="{ src: AI_ICON_PATH, alt: 'AI Icon' }"
      :is-full-width="true"
    />

    <footer
      v-if="!props.isAdmin"
      class="pt-6 pb-4 text-center text-brand text-sm"
    >
      AlmaSpot • Made for students
    </footer>
  </div>
</template>
