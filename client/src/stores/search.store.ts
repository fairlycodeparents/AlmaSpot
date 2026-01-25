import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { searchService } from "../services/search.service";

export const useSearchStore = defineStore("search", () => {
  const availableCampuses = ref<string[]>([]);

  const selectedCampus = ref<string>("");
  const selectedDate = ref<string>(
    new Date().toISOString().split("T")[0] ?? "",
  );
  const selectedTime = ref<string>("09:00");
  const selectedDuration = ref<number>(1);

  const campusOptions = computed(() =>
    availableCampuses.value.map((c) => ({ label: c, value: c })),
  );

  const searchPayload = computed(() => {
    const startObj = new Date(`${selectedDate.value}T${selectedTime.value}:00`);
    const endObj = new Date(
      startObj.getTime() + selectedDuration.value * 60 * 60 * 1000,
    );

    return {
      campus: selectedCampus.value,
      start: startObj.toISOString(),
      end: endObj.toISOString(),
    };
  });

  async function fetchCampuses() {
    if (availableCampuses.value.length > 0) return;
    try {
      availableCampuses.value = await searchService.getCampuses();
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

  function setSearchCriteria(
    campus: string,
    date: string,
    time: string,
    duration: number,
  ) {
    selectedCampus.value = campus;
    selectedDate.value = date;
    selectedTime.value = time;
    selectedDuration.value = duration;
  }

  return {
    availableCampuses,
    selectedCampus,
    selectedDate,
    selectedTime,
    selectedDuration,
    campusOptions,
    searchPayload,
    fetchCampuses,
    setSearchCriteria,
  };
});
