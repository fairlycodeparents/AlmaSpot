<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useSearchStore } from '../stores/search.store';
import { useAdminStore } from '../stores/admin.store';
import { useResultStore } from "@/stores/result.store.ts";
import RoomCard from '../components/RoomCard.vue';
import MyButton from '../components/Button.vue';
import FilterPanel from "@/components/FilterPanel.vue";

const router = useRouter();
const resultStore = useResultStore();
const searchStore = useSearchStore();
const adminStore = useAdminStore();

const props = defineProps<{
  variant: 'student' | 'admin' | 'delete';
}>();

const isFilterOpen = ref(false);
const ARROW_ICON_PATH = "/icons/arrow-right.svg";
const FILTER_ICON_PATH = "/icons/filter.svg";
const X_ICON_PATH = "/icons/x_small.svg";
const TRASH_ICON_PATH = "/icons/delete.svg";

const onApplyFilters = (newFilters: { type: string; site: string }) => {
  resultStore.setFilters(newFilters);
};

const { campus, start, end } = searchStore.searchPayload;

const goBack = () => {
  if (props.variant === 'admin' || props.variant === 'delete') {
    router.push({ name: 'admin-home' });
  } else {
    router.push({ name: 'home' });
  }
};

const goToAI = () => {
  router.push({
    name: 'assistant',
    query: {
      campus,
      start,
      end
    }});
};

const handleDelete = async (item: any) => {
  await adminStore.deleteActivity(item.id);
  if (adminStore.scheduledActivities.length === 0) {
    await router.push({ name: 'admin-home'});
  }
};

const formatTime = (start: string, end: string) => {
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

const handleSelectRoom = async (item: any) => {
  if (props.variant === 'admin') {
    try {
      const success = await adminStore.confirmRoomSelection(item);
      if (success) {
        alert(
            `Attività "${adminStore.pendingActivity.title}" creata con successo in ${item.room.name}!`,
        );
        await router.push({ name: "admin-home" });
      } else if (adminStore.error)
          alert(adminStore.error);
    } catch (error: any) {
      alert(error.message || "Errore generico");
      await router.push({ name: "admin-home" });
    }
  } else if (props.variant === 'student') {
      await router.push({name: "plan"});
  }
};
</script>

<template>
  <div
      class="min-h-screen bg-brand-text flex flex-col px-6 pt-12 pb-6 relative"
  >
    <div class="mb-6">
      <h1 v-if="variant === 'admin' || variant === 'student'"
          class="text-4xl font-bold text-brand leading-tight">
        Soluzioni disponibili
      </h1>
      <h1 v-if="variant === 'delete'"
          class="text-4xl font-bold text-brand leading-tight">
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
          v-if="(resultStore.filteredRooms.length === 0)"
          class="text-center mt-10 flex flex-col items-center gap-2"
      >
        <p v-if="variant === 'admin' || variant === 'student'"
           class="text-base-text font-bold text-lg">
          Nessuna aula disponibile per i criteri selezionati.
        </p>
        <p v-if="variant === 'delete'"
           class="text-base-text font-bold text-lg">
          Nessuna attività programmata trovata.
        </p>

        <button
            v-if="variant === 'student'"
            type="button"
            @click="goToAI"
            class="text-primary font-semibold hover:underline flex items-center justify-center gap-2 w-full transition-colors hover:text-red-700">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
          </svg>
          Chiedi un'aula all'AI
        </button>
      </div>

      <RoomCard
          v-if="variant === 'admin' || variant === 'student'"
          v-for="item in resultStore.filteredRooms"
          :key="item.room.id"
          :title="item.room.name"
          :subtitle="`${item.room.campus} - ${item.room.site?.address || item.room.site?.name}`"
          :button-icon="ARROW_ICON_PATH"
          :button-action="() => handleSelectRoom(item)"
          class="w-full max-w-none bg-ui-card"
      />
      <RoomCard
          v-if="variant === 'delete'"
          v-for="item in resultStore.filteredRooms"
          :key="item.id"
          :title="item.title"
          :subtitle="`Aula ${item.roomId} - ${formatTime(item.startTime, item.endTime)}`"
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