import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useResultStore = defineStore("result", () => {
  const allRooms = ref<any[]>([]);

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
      allRooms.value.map((i: any) => getLabelForType(i.room.type)),
    );
    return ["Qualsiasi", ...types];
  });

  const availableSites = computed(() => {
    const sites = new Set(allRooms.value.map((i: any) => i.room.site.address));
    return ["Qualsiasi", ...sites];
  });

  const filteredRooms = computed(() => {
    return allRooms.value.filter((item: any) => {
      const matchType =
        filters.value.type === "Qualsiasi" ||
        getLabelForType(item.room.type) === filters.value.type;

      const matchSite =
        filters.value.site === "Qualsiasi" ||
        item.room.site.address === filters.value.site;

      return matchType && matchSite;
    });
  });

  const getLabelForType = (dbType: string) => {
    return TYPE_TRANSLATIONS[dbType] || dbType;
  };

  function setRooms(rooms: any[]) {
    allRooms.value = rooms;
    resetFilters();
  }

  function setFilters(newFilters: { type: string; site: string }) {
    filters.value = newFilters;
  }

  function resetFilters() {
    filters.value = { type: "Qualsiasi", site: "Qualsiasi" };
  }

  return {
    allRooms,
    filters,
    availableTypes,
    availableSites,
    filteredRooms,
    setFilters,
    resetFilters,
    setRooms,
  };
});
