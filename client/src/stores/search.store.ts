import { defineStore } from "pinia";
import { ref } from "vue";
import { searchService } from "../services/search.service";
import { useResultStore } from "@/stores/result.store.ts";
import type { SearchPayload } from "@/types/api";

export const useSearchStore = defineStore("search", () => {
  const availableRooms = ref<any[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const resultStore = useResultStore();

  async function searchRooms(rawPayload: SearchPayload) {
    resultStore.resetFilters();
    isLoading.value = true;
    error.value = null;
    availableRooms.value = [];
    const date =
      rawPayload.date === "Oggi"
        ? new Date().toISOString().split("T")[0]
        : new Date(Date.now() + 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0];
    const start = new Date(`${date}T${rawPayload.time}:00`);
    const end = new Date(
      start.getTime() + rawPayload.duration * 60 * 60 * 1000,
    );

    try {
      availableRooms.value = await searchService.findExactRooms({
        campus: rawPayload.campus,
        start: start.toISOString(),
        end: end.toISOString(),
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

  return {
    searchRooms,
    availableRooms,
    isLoading,
    error,
  };
});
