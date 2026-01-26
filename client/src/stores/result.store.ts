import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { RoomAvailabilityDTO, ActivityDTO } from "@/types/api";

export type ResultItem = RoomAvailabilityDTO | ActivityDTO;

export const useResultStore = defineStore("result", () => {
  const allRooms = ref<ResultItem[]>([]);

  const filters = ref({
    type: "Qualsiasi",
    site: "Qualsiasi",
  });

  const TYPE_TRANSLATIONS: Record<string, string> = {
    CLASSROOM: "Aula",
    LABORATORY: "Laboratorio",
  };

  function isRoomAvailability(item: ResultItem): item is RoomAvailabilityDTO {
    return (item as RoomAvailabilityDTO).room !== undefined;
  }

  const detectType = (item: ResultItem) => {
    if (isRoomAvailability(item)) {
      return getLabelForType(item.room.type);
    }

    if (item.roomId) {
      const idLower = item.roomId.toLowerCase();
      if (idLower.includes("lab")) return "Laboratorio";
      return "Aula";
    }
    return "Aula";
  };

  const detectSite = (item: ResultItem) => {
    if (isRoomAvailability(item)) {
      return item.room.site.address;
    }
    return null;
  };

  const availableTypes = computed(() => {
    const types = new Set(allRooms.value.map((i) => detectType(i)));
    return ["Qualsiasi", ...types].filter((t) => t !== "Sconosciuto");
  });

  const availableSites = computed(() => {
    const sites = new Set(
      allRooms.value
        .map((i) => detectSite(i))
        .filter((s): s is string => s !== null),
    );
    return ["Qualsiasi", ...sites];
  });

  const filteredRooms = computed(() => {
    return allRooms.value.filter((item) => {
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

  function setRooms(rooms: ResultItem[]) {
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
