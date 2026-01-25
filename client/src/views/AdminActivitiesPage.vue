<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAdminStore } from "@/stores/admin.store";
import RoomCard from "@/components/RoomCard.vue";
import Button from "@/components/Button.vue";
import { ref } from "vue";
import FilterPanel from "@/components/FilterPanel.vue";

const router = useRouter();
const adminStore = useAdminStore();
const isFilterOpen = ref(false);

const TRASH_ICON_PATH = "/icons/delete.svg";
const FILTER_ICON_PATH = "/icons/filter.svg";

const onApplyFilters = (newFilters: { type: string; site: string }) => {
  adminStore.setFilters(newFilters);
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

const handleDelete = async (item: any) => {
  await adminStore.deleteActivity(item.id);
  if (adminStore.scheduledActivities.length === 0) {
    router.push("/admin");
  }
};
</script>

<template>
  <div
    class="min-h-screen bg-brand-text flex flex-col px-6 pt-12 pb-6 relative"
  >
    <div class="mb-6">
      <h1 class="text-4xl font-bold text-brand leading-tight">
        Attività<br />programmate
      </h1>
    </div>

    <div class="mb-6">
      <Button
        label="Filtra risultati"
        :action="() => (isFilterOpen = true)"
        :icon="{ src: FILTER_ICON_PATH, alt: 'Icona filtro' }"
        :is-icon-right="false"
      />
    </div>

    <div class="flex flex-col gap-4 flex-1 overflow-y-auto pb-20">
      <div
        v-if="adminStore.scheduledActivities.length === 0"
        class="text-center text-base-text mt-10"
      >
        Nessuna attività programmata trovata.
      </div>

      <RoomCard
        v-for="item in adminStore.scheduledActivities"
        :key="item.id"
        :title="item.title"
        :subtitle="`Aula ${item.roomId} - ${formatTime(item.startTime, item.endTime)}`"
        :button-icon="TRASH_ICON_PATH"
        :button-action="() => handleDelete(item)"
        class="w-full max-w-none bg-ui-card"
      />
    </div>

    <FilterPanel
      :is-open="isFilterOpen"
      :available-types="adminStore.availableTypes"
      :available-sites="adminStore.availableSites"
      :current-type="adminStore.filters.type"
      :current-site="adminStore.filters.site"
      @close="isFilterOpen = false"
      @apply="onApplyFilters"
    />

    <div class="mt-auto pt-4 flex justify-center">
      <Button
        label="Torna alla ricerca"
        :action="() => router.push('/admin')"
      />
    </div>
  </div>
</template>
