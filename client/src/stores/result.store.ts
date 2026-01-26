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

  const detectType = (item: any) => {
    if (item.room && item.room.type) {
      return getLabelForType(item.room.type);
    }

    if (item.roomId) {
      const idLower = item.roomId.toLowerCase();
      if (idLower.includes("lab")) {
        return "Laboratorio";
      }
      return "Aula";
    }
    return "Aula";
  };

  const detectSite = (item: any) => {
    if (item.room && item.room.site) {
      return item.room.site.address;
    }
    return null;
  };

  const availableTypes = computed(() => {
    const types = new Set(allRooms.value.map((i: any) => detectType(i)));
    return ["Qualsiasi", ...types].filter((t) => t !== "Sconosciuto");
  });

  const availableSites = computed(() => {
    const sites = new Set(
      allRooms.value
        .map((i: any) => detectSite(i))
        .filter((s: any) => s !== null),
    );
    return ["Qualsiasi", ...sites];
  });

  const filteredRooms = computed(() => {
    return allRooms.value.filter((item: any) => {
      const itemType = detectType(item);
      const itemSite = detectSite(item);
      const matchType =
        filters.value.type === "Qualsiasi" || itemType === filters.value.type;
      const matchSite =
        filters.value.site === "Qualsiasi" ||
        (itemSite && itemSite === filters.value.site);

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
