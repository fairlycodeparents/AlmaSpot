<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useParameterStore } from "../stores/parameter.store";
import { useAdminStore } from "../stores/admin.store";
import { useResultStore } from "@/stores/result.store";
import RoomCard from "../components/RoomCard.vue";
import MyButton from "../components/Button.vue";
import FilterPanel from "@/components/FilterPanel.vue";
import { usePlanSession } from "@/composables/usePlanSession";
import type { ActivityDTO, RoomAvailabilityDTO } from "@/types/api";

const router = useRouter();
const { activatePlan } = usePlanSession();
const resultStore = useResultStore();
const parameterStore = useParameterStore();
const adminStore = useAdminStore();

const pageError = ref("");
const pageSuccess = ref("");

const props = defineProps<{
  variant: "student" | "admin" | "delete";
}>();

const roomResults = computed(() => {
  return resultStore.filteredRooms as RoomAvailabilityDTO[];
});

const activityResults = computed(() => {
  return resultStore.filteredRooms as ActivityDTO[];
});

const isFilterOpen = ref(false);
const ARROW_ICON_PATH = "/icons/arrow-right.svg";
const FILTER_ICON_PATH = "/icons/filter.svg";
const X_ICON_PATH = "/icons/x_small.svg";
const TRASH_ICON_PATH = "/icons/delete.svg";

const onApplyFilters = (newFilters: { type: string; site: string }) => {
  resultStore.setFilters(newFilters);
};

const goBack = () => {
  router.back();
};

const campus = parameterStore.selectedCampus;
const date = parameterStore.selectedDate;
const start = parameterStore.selectedTime;
const duration = parameterStore.selectedDuration;

const goToAI = () => {
  router.push({
    name: "assistant",
    query: {
      campus,
      date,
      start,
      duration,
    },
  });
};

const handleDelete = async (item: any) => {
  pageError.value = "";
  pageSuccess.value = "";

  try {
    await adminStore.deleteActivity(item.id);
    if (adminStore.scheduledActivities.length === 0) {
      adminStore.setSuccessMessage("Tutte le attività sono state rimosse.");
      router.back();
    } else {
      pageSuccess.value = "Attività eliminata con successo.";
    }
  } catch (error: any) {
    pageError.value = error.message || "Errore durante l'eliminazione.";
  }
};

const formatTime = (start: string | Date, end: string | Date) => {
  const s = new Date(start).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const e = new Date(end).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${s} - ${e}`;
};

const handleSelectRoom = async (item: RoomAvailabilityDTO) => {
  pageError.value = "";
  pageSuccess.value = "";

  if (props.variant === "admin") {
    try {
      const success = await adminStore.confirmRoomSelection(item);
      if (success) {
        adminStore.setSuccessMessage("Attività creata con successo!");
        router.back();
      }
    } catch (error: any) {
      pageError.value =
        error.message || "Errore generico durante la creazione.";
    }
  } else if (props.variant === "student") {
    const targetDate = new Date();
    if (date !== "Oggi") {
      targetDate.setDate(targetDate.getDate() + 1);
    }
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth();
    const day = targetDate.getDate();
    const [hours, minutes] = start.split(":").map(Number);
    const startDate = new Date(Date.UTC(year, month, day, hours, minutes));
    const endDate = new Date(startDate.getTime() + Number(duration) * 3600000);
    await activatePlan(router, [
      {
        id: item.room.id,
        name: item.room.name,
        campus: item.room.campus,
        address: item.room.site?.address || "",
        from: startDate.toISOString(),
        to: endDate.toISOString(),
      },
    ]);
  }
};
</script>

<template>
  <div class="h-screen bg-brand-text flex flex-col px-6 pt-10 pb-6 relative">
    <div class="mb-6">
      <h1
        v-if="variant === 'admin' || variant === 'student'"
        class="text-4xl font-bold text-brand leading-tight"
      >
        Soluzioni disponibili
      </h1>
      <h1
        v-if="variant === 'delete'"
        class="text-4xl font-bold text-brand leading-tight"
      >
        Attività programmate
      </h1>
    </div>

    <div class="mb-6 flex items-center gap-3">
      <MyButton
        label="Filtra risultati"
        :action="() => (isFilterOpen = true)"
        :icon="{ src: FILTER_ICON_PATH, alt: 'Icona filtro' }"
        :is-icon-right="false"
      />

      <MyButton
        label="Rimuovi filtri"
        :action="resultStore.resetFilters"
        :icon="{ src: X_ICON_PATH, alt: 'Icona Elimina filtro' }"
        :is-icon-right="false"
        v-if="
          resultStore.filters.type !== 'Qualsiasi' ||
          resultStore.filters.site !== 'Qualsiasi'
        "
      />
    </div>

    <div class="flex flex-col gap-4 flex-1 overflow-y-auto pb-20">
      <div
        v-if="resultStore.filteredRooms.length === 0"
        class="text-center mt-10 flex flex-col items-center gap-2"
      >
        <p
          v-if="variant === 'admin' || variant === 'student'"
          class="text-base-text font-bold text-lg"
        >
          Nessuna aula disponibile per i criteri selezionati.
        </p>
        <p v-if="variant === 'delete'" class="text-base-text font-bold text-lg">
          Nessuna attività programmata trovata.
        </p>

        <button
          v-if="variant === 'student'"
          type="button"
          @click="goToAI"
          class="text-primary font-semibold hover:underline flex items-center justify-center gap-2 w-full transition-colors hover:text-red-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"
            />
          </svg>
          Chiedi un'aula all'AI
        </button>
      </div>

      <RoomCard
        v-if="variant === 'admin' || variant === 'student'"
        v-for="item in roomResults"
        :key="item.room.id"
        :title="item.room.name"
        :subtitle="`${item.room.campus} - ${item.room.site?.address}`"
        :button-icon="ARROW_ICON_PATH"
        :button-action="() => handleSelectRoom(item)"
        class="w-full max-w-none bg-ui-card"
      />

      <div class="flex flex-col gap-3 mb-4">
        <div
          v-if="pageError"
          class="text-brand text-sm font-semibold text-center bg-error-card p-2 rounded-2xl border border-brand"
        >
          {{ pageError }}
        </div>

        <div
          v-if="pageSuccess"
          class="text-state-success text-sm font-semibold text-center bg-success-card p-2 rounded-2xl border border-state-success"
        >
          {{ pageSuccess }}
        </div>
      </div>

      <RoomCard
        v-if="variant === 'delete'"
        v-for="item in activityResults"
        :key="item.id"
        :title="item.title"
        :subtitle="`${item.roomId} - ${formatTime(item.startTime, item.endTime)}`"
        :button-icon="TRASH_ICON_PATH"
        :button-action="() => handleDelete(item)"
        class="w-full max-w-none bg-ui-card"
      />
    </div>

    <div class="mt-auto pt-4 flex justify-center">
      <MyButton label="Torna alla ricerca" :action="goBack" />
    </div>

    <FilterPanel
      :is-open="isFilterOpen"
      :available-types="resultStore.availableTypes"
      :available-sites="resultStore.availableSites"
      :current-type="resultStore.filters.type"
      :current-site="resultStore.filters.site"
      @close="isFilterOpen = false"
      @apply="onApplyFilters"
    />
  </div>
</template>
