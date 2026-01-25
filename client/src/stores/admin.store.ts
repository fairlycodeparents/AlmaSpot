import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { adminService } from "@/services/admin.service";

export const useAdminStore = defineStore("admin", () => {
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const availableRooms = ref<any[]>([]);
  const pendingActivity = ref({
    title: "",
    start: "",
    end: "",
  });
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

  function setFilters(newFilters: { type: string; site: string }) {
    filters.value = newFilters;
  }

  function resetFilters() {
    filters.value = { type: "Qualsiasi", site: "Qualsiasi" };
  }

  const getLabelForType = (dbType: string) => {
    return TYPE_TRANSLATIONS[dbType] || dbType;
  };

  const calculateTimeRange = (
    dayStr: string,
    timeStr: string,
    durationHours: number,
  ) => {
    const startDate = new Date();
    if (dayStr === "Domani") startDate.setDate(startDate.getDate() + 1);

    const [hours, minutes] = timeStr.replace(".", ":").split(":").map(Number);
    //@ts-ignore
    startDate.setHours(hours, minutes || 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + durationHours);

    return { start: startDate.toISOString(), end: endDate.toISOString() };
  };

  async function searchAvailableRooms(rawPayload: any) {
    resetFilters();
    isLoading.value = true;
    error.value = null;
    availableRooms.value = [];

    try {
      const { start, end } = calculateTimeRange(
        rawPayload.date,
        rawPayload.time,
        rawPayload.duration,
      );

      pendingActivity.value = {
        title: rawPayload.activity,
        start: start,
        end: end,
      };

      const rooms = await adminService.searchRooms({
        campus: rawPayload.location,
        start: start,
        end: end,
      });

      availableRooms.value = rooms;

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

  // Create activities
  async function confirmRoomSelection(selectedRoomWrapper: any) {
    const actualRoom = selectedRoomWrapper.room;

    if (!pendingActivity.value.title) {
      alert("Dati attività mancanti. Effettua nuovamente la ricerca.");
      return false;
    }

    const apiPayload = {
      title: pendingActivity.value.title,
      campus: actualRoom.campus,
      startTime: pendingActivity.value.start,
      endTime: pendingActivity.value.end,
      roomId: actualRoom.id,
      site: actualRoom.site.address,
    };
    isLoading.value = true;
    try {
      await adminService.addActivity(apiPayload);
      return true;
    } catch (e: any) {
      console.error(e);
      error.value = e.message || "Errore durante la creazione dell'attività";
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    isLoading,
    error,
    availableRooms,
    pendingActivity,
    filters,
    availableTypes,
    availableSites,
    filteredRooms,
    setFilters,
    resetFilters,
    searchAvailableRooms,
    confirmRoomSelection,
  };
});
