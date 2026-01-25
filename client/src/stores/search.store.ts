import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { searchService } from "../services/search.service";

export const useSearchStore = defineStore("search", () => {
  const availableCampuses = ref<string[]>([]);
  const availableRooms = ref<any[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const filters = ref({
    type: "Qualsiasi",
    site: "Qualsiasi",
  });
  const TYPE_TRANSLATIONS: Record<string, string> = {
    CLASSROOM: "Aula",
    LABORATORY: "Laboratorio",
  };

  const availableTypes = computed(() => {
    const types = new Set(
      availableRooms.value.map((i: any) => getLabelForType(i.room.type)),
    );
    return ["Qualsiasi", ...types];
  });

  const availableSites = computed(() => {
    const sites = new Set(
      availableRooms.value.map((i: any) => i.room.site.address),
    );
    return ["Qualsiasi", ...sites];
  });

  const filteredRooms = computed(() => {
    return availableRooms.value.filter((item: any) => {
      const room = item.room;
      const roomLabel = getLabelForType(room.type);

      const matchType =
        filters.value.type === "Qualsiasi" || roomLabel === filters.value.type;

      const currentSiteName = room.site.address;
      const matchSite =
        filters.value.site === "Qualsiasi" ||
        currentSiteName === filters.value.site;

      return matchType && matchSite;
    });
  });

  const getLabelForType = (dbType: string) => {
    return TYPE_TRANSLATIONS[dbType] || dbType;
  };

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

  async function searchRooms() {
    resetFilters();
    isLoading.value = true;
    error.value = null;
    availableRooms.value = [];

    try {
      availableRooms.value = await searchService.findExactRooms({
        campus: searchPayload.value.campus,
        start: searchPayload.value.start,
        end: searchPayload.value.end,
      });
      return true;
    } catch (err: any) {
      console.error("Errore ricerca:", err);
      error.value =
        err.message || "Nessuna aula disponibile con questi criteri.";
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  function setFilters(newFilters: { type: string; site: string }) {
    filters.value = newFilters;
  }

  function resetFilters() {
    filters.value = { type: "Qualsiasi", site: "Qualsiasi" };
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
    searchRooms,
    availableRooms,
    filteredRooms,
    isLoading,
    error,
    filters,
    availableTypes,
    availableSites,
    setFilters,
    resetFilters,
  };
});
