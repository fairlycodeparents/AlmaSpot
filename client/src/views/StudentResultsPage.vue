<script setup lang="ts">
import {ref} from 'vue';
import {useRouter} from 'vue-router';
import {useSearchStore} from '../stores/search.store';
import RoomCard from '../components/RoomCard.vue';
import Button from '../components/Button.vue';
import FilterPanel from "@/components/FilterPanel.vue";

const router = useRouter();
const searchStore = useSearchStore();

const isFilterOpen = ref(false);
const ARROW_ICON_PATH = "/icons/arrow-right.svg";
const FILTER_ICON_PATH = "/icons/filter.svg";
const X_ICON_PATH = "/icons/x_small.svg";

const onApplyFilters = (newFilters: { type: string; site: string }) => {
  searchStore.setFilters(newFilters);
};

const goBack = () => {
  router.push({ name: 'home' });
};

const handleSelectRoom = (_item: any) => {
  router.push("plan");
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
          :action="searchStore.resetFilters"
          :icon="{ src: X_ICON_PATH, alt: 'Icona Elimina filtro' }"
          :is-icon-right="false"
          v-if="
          searchStore.filters.type !== 'Qualsiasi' ||
          searchStore.filters.site !== 'Qualsiasi'
        "
      />
    </div>

    <div class="flex flex-col gap-4 flex-1 overflow-y-auto pb-20">
      <div
          v-if="searchStore.filteredRooms.length === 0"
          class="text-center text-base-text mt-10"
      >
        Nessuna aula corrisponde ai filtri.
      </div>

      <RoomCard
          v-for="item in searchStore.filteredRooms"
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
        :available-types="searchStore.availableTypes"
        :available-sites="searchStore.availableSites"
        :current-type="searchStore.filters.type"
        :current-site="searchStore.filters.site"
        @close="isFilterOpen = false"
        @apply="onApplyFilters"
    />
  </div>
</template>