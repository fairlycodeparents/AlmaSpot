<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAdminStore } from "@/stores/admin.store";
import RoomCard from "@/components/RoomCard.vue";
import Button from "@/components/Button.vue";
import { ref } from "vue";
import FilterPanel from "@/components/FilterPanel.vue";
import { useResultStore } from "@/stores/result.store.ts";
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

      <Button
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
        class="text-center text-base-text mt-10"
      >
        Nessuna attività programmata trovata.
      </div>

      <RoomCard
        v-for="item in resultStore.filteredRooms"
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
      :available-types="resultStore.availableTypes"
      :available-sites="resultStore.availableSites"
      :current-type="resultStore.filters.type"
      :current-site="resultStore.filters.site"
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
