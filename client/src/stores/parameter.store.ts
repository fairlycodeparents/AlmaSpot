import { defineStore } from "pinia";
import { parameterService } from "@/services/parameter.service.ts";
import { computed, ref } from "vue";

export const useParameterStore = defineStore("parameter", () => {
  const error = ref<string | null>(null);
  const availableCampuses = ref<string[]>([]);

  const selectedCampus = ref<string>("");
  const selectedDate = ref<string>("Oggi");
  const selectedTime = ref<string>("09:00");
  const selectedDuration = ref<number>(1);

  const campusOptions = computed(() =>
    availableCampuses.value.map((c) => ({ label: c, value: c })),
  );

  async function fetchCampuses() {
    if (availableCampuses.value.length > 0) return;
    try {
      availableCampuses.value = await parameterService.getCampuses();
    } catch (error) {
      console.error("Failed to load campuses", error);
      availableCampuses.value = [
        "Cesena",
        "Bologna",
        "Forlì",
        "Ravenna",
        "Rimini",
      ];
    }
  }

  return {
    fetchCampuses,
    campusOptions,
    selectedCampus,
    selectedDate,
    selectedTime,
    selectedDuration,
    error,
  };
});
