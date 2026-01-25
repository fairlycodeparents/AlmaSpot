<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useSearchStore } from '../stores/search.store';
import { searchService } from '../services/search.service';
import RoomCard from '../components/RoomCard.vue';
import Button from '../components/Button.vue';

const router = useRouter();
const searchStore = useSearchStore();

const isLoading = ref(true);
const results = ref<any[]>([]); // Qui ci andrà il tipo RoomAvailabilityDTO

const fetchResults = async () => {
  isLoading.value = true;
  try {
    const payload = searchStore.searchPayload;

    console.log("Searching with payload:", payload);

    const data = await searchService.findExactRooms(payload);
    results.value = data;
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const goBack = () => {
  router.push({ name: 'home' });
};

const selectRoom = (roomId: string) => {
  router.push({ name: 'plan', params: { roomId } });
};

onMounted(() => {
  fetchResults();
});
</script>

<template>
  <div class="min-h-screen bg-base-grey p-4 md:p-8">

    <header class="max-w-4xl mx-auto flex items-center justify-between mb-8">
      <div class="flex items-center gap-4">
        <button @click="goBack" class="p-2 hover:bg-gray-200 rounded-full transition-colors">
          <img src="/icons/arrow-left.svg" alt="Back" class="w-6 h-6" />
        </button>
        <div>
          <h1 class="text-2xl font-serif font-bold text-gray-900">Risultati Ricerca</h1>
          <p class="text-sm text-gray-500">
            {{ searchStore.selectedCampus }} • {{ searchStore.selectedDate }} • {{ searchStore.selectedDuration }} ore
          </p>
        </div>
      </div>

    </header>

    <main class="max-w-4xl mx-auto space-y-4">

      <div v-if="isLoading" class="text-center py-12 text-gray-500">
        Caricamento aule disponibili...
      </div>

      <div v-else-if="results.length === 0" class="text-center py-12 bg-white rounded-xl shadow-sm">
        <p class="text-gray-500 text-lg">Nessuna aula trovata con questi criteri.</p>
        <Button variant="secondary" class="mt-4" @click="goBack">Modifica Ricerca</Button>
      </div>

      <div v-else class="grid gap-4">
        <RoomCard
            v-for="room in results"
            :key="room.id"
            :roomName="room.name"
            :status="room.availability ? 'free' : 'busy'"
            :nextEvent="room.nextEvent || 'Nessuna attività prevista'"
            :features="room.equipment"
            @click="selectRoom(room.id)"
            class="cursor-pointer hover:shadow-md transition-shadow"
        />
      </div>
    </main>
  </div>
</template>