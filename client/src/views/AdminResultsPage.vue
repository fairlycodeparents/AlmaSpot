<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAdminStore } from "@/stores/admin.store";
import RoomCard from "@/components/RoomCard.vue";
import Button from "@/components/Button.vue";
import FilterPanel from "@/components/FilterPanel.vue";

const router = useRouter();
const adminStore = useAdminStore();
const isFilterOpen = ref(false);
const ARROW_ICON_PATH = "/icons/arrow-right.svg";
const FILTER_ICON_PATH = "/icons/filter.svg";
const X_ICON_PATH = "/icons/x_small.svg";

const handleSelectRoom = async (item: any) => {
  try {
    const success = await adminStore.confirmRoomSelection(item);
    if (success) {
      alert(
        `Attività "${adminStore.pendingActivity.title}" creata con successo in ${item.room.name}!`,
      );
      router.push("/admin");
    } else {
      if (adminStore.error) alert(adminStore.error);
    }
  } catch (error: any) {
    alert(error.message || "Errore generico");
    router.push("/admin");
  }
};

const onApplyFilters = (newFilters: { type: string; site: string }) => {
  adminStore.setFilters(newFilters);
};

const goBack = () => {
  router.push("/admin");
};
</script>

<template>
  <div
    class="min-h-screen bg-brand-text flex flex-col px-6 pt-12 pb-6 relative"
  >
    <div class="mb-6">
      <h1 class="text-4xl font-bold text-brand leading-tight">
        Soluzioni<br />disponibili
      </h1>
    </div>

    <div class="mb-6 flex items-center gap-3">
      <Button
        label="Filtra risultati"
        :action="() => (isFilterOpen = true)"
        :icon="{ src: FILTER_ICON_PATH, alt: 'Icona filtro' }"
        :is-icon-right="false"
      />

      <Button
        label="Rimuovi filtri"
        :action="adminStore.resetFilters"
        :icon="{ src: X_ICON_PATH, alt: 'Icona Elimina filtro' }"
        :is-icon-right="false"
        v-if="
          adminStore.filters.type !== 'Qualsiasi' ||
          adminStore.filters.site !== 'Qualsiasi'
        "
      />
    </div>

    <div class="flex flex-col gap-4 flex-1 overflow-y-auto pb-20">
      <div
        v-if="adminStore.filteredRooms.length === 0"
        class="text-center text-base-text mt-10"
      >
        Nessuna aula corrisponde ai filtri.
      </div>

      <RoomCard
        v-for="item in adminStore.filteredRooms"
        :key="item.room.id"
        :title="item.room.name"
        :subtitle="`${item.room.campus} - ${item.room.site?.address || item.room.site?.name}`"
        :button-icon="ARROW_ICON_PATH"
        :button-action="() => handleSelectRoom(item)"
        class="w-full max-w-none bg-ui-card"
      />
    </div>

    <div class="mt-auto pt-4 flex justify-center">
      <Button label="Torna alla ricerca" :action="goBack" />
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
  </div>
</template>
