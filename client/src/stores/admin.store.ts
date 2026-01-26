import { defineStore } from "pinia";
import { ref } from "vue";
import { adminService } from "@/services/admin.service";
import { useResultStore } from "@/stores/result.store.ts";

export const useAdminStore = defineStore("admin", () => {
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const availableRooms = ref<any[]>([]);

  const resultStore = useResultStore();

  const pendingActivity = ref({
    title: "",
    start: "",
    end: "",
  });

  const scheduledActivities = ref<any[]>([]);

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
    resultStore.resetFilters();
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

      availableRooms.value = await adminService.searchRooms({
        campus: rawPayload.location,
        start: start,
        end: end,
      });

      resultStore.setRooms(availableRooms.value);
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

  // Delete activities
  const getDateFromLabel = (label: string) => {
    const d = new Date();
    if (label === "Domani") d.setDate(d.getDate() + 1);
    return d.toISOString();
  };

  async function searchActivities(payload: any) {
    isLoading.value = true;
    error.value = null;
    scheduledActivities.value = [];

    try {
      const [userHour, userMinute] = payload.time
        .replace(".", ":")
        .split(":")
        .map(Number);
      const maxDuration = Number(payload.duration);
      const dateIso = getDateFromLabel(payload.date);
      const activities = await adminService.getActivities(
        payload.location,
        dateIso,
      );

      scheduledActivities.value = activities.filter((a: any) => {
        const actStart = new Date(a.startTime);
        const actEnd = new Date(a.endTime);
        const isSameStartTime =
          actStart.getHours() === userHour &&
          actStart.getMinutes() === (userMinute || 0);
        const diffMs = actEnd.getTime() - actStart.getTime();
        const durationInHours = diffMs / (1000 * 60 * 60);
        const isDurationValid = durationInHours <= maxDuration;

        return isSameStartTime && isDurationValid;
      });

      return true;
    } catch (err: any) {
      error.value = err.message || "Errore nel caricamento attività";
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteActivity(activityId: string) {
    if (!confirm("Sei sicuro di voler eliminare questa attività?"))
      return false;

    isLoading.value = true;
    try {
      await adminService.deleteActivity(activityId);

      scheduledActivities.value = scheduledActivities.value.filter(
        (a) => a.id !== activityId,
      );

      alert("Attività eliminata con successo");
      return true;
    } catch (e: any) {
      alert(e.message || "Errore durante l'eliminazione");
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
    searchAvailableRooms,
    confirmRoomSelection,
    scheduledActivities,
    searchActivities,
    deleteActivity,
  };
});
