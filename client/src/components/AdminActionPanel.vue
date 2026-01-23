<script setup lang="ts">
import { ref } from "vue";
import SegmentedButton from "./SegmentedButton.vue";
import InputText from "./InputText.vue";
import Dropdown from "./Dropdown.vue";
import Button from "./Button.vue";
import DurationSelector from "./DurationSelector.vue";

const mode = ref("aggiungi");
const activityName = ref("");
const location = ref("Cesena");
const date = ref("Oggi");
const time = ref("09.00");
const duration = ref(1);
const emit = defineEmits(["submit"]);

const modeOptions = [
  { label: "Aggiungi", value: "aggiungi" },
  { label: "Rimuovi", value: "rimuovi" },
];

const generateTimeSlots = () => {
  return Array.from({ length: 11 }, (_, i) => {
    const hour = (i + 9).toString().padStart(2, "0");
    return `${hour}:00`;
  });
};

const locations = ["Cesena", "Bologna", "Rimini", "Ravenna", "Forlì"];
const dates = ["Oggi", "Domani"];
const times = generateTimeSlots();

const handleSubmit = () => {
  emit("submit", {
    mode: mode.value,
    activity: activityName.value,
    location: location.value,
    date: date.value,
    time: time.value,
    duration: duration.value,
  });
};
</script>

<template>
  <div
    class="bg-base-background w-full rounded-t-[30px] p-6 pb-10 flex flex-col gap-5 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]"
  >
    <div class="w-full">
      <SegmentedButton
        v-model="mode"
        :options="modeOptions"
        container-class="w-full"
      />
    </div>

    <InputText
      v-if="mode === 'aggiungi'"
      required="true"
      label="Nome attività"
      placeholder="Inserisci il nome dell'attività"
      v-model="activityName"
    />

    <Dropdown v-model="location" :options="locations" :is-full-width="true" />

    <div class="flex gap-4">
      <div class="flex-1">
        <Dropdown v-model="date" :options="dates" :is-full-width="true" />
      </div>
      <div class="flex-1">
        <Dropdown v-model="time" :options="times" :is-full-width="true" />
      </div>
    </div>

    <DurationSelector
      v-model="duration"
      :min="1"
      :max="12"
      class="max-w-full!"
    />

    <div class="flex justify-center w-full">
      <Button
        label="Cerca"
        :action="handleSubmit"
        :is-full-width="true"
      />
    </div>
  </div>
</template>
