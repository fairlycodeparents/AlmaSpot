<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useSearchStore } from '../stores/search.store';

import Dropdown from '../components/Dropdown.vue';
import MyButton from '../components/Button.vue';
import DurationSelector from '../components/DurationSelector.vue';

const router = useRouter();
const searchStore = useSearchStore();

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const formatDate = (d: Date): string => d.toISOString().split('T')[0];
const dateOptions: { label: string; value: string }[] = [
  { label: 'Oggi', value: formatDate(today) },
  { label: 'Domani', value: formatDate(tomorrow) }
];
const timeOptions = Array.from({ length: 12 }, (_, i) => {
  const hour = i + 8;
  const time = `${hour.toString().padStart(2, '0')}:00`;
  return { label: time, value: time };
});
const campus = ref(searchStore.selectedCampus || '');
const date = ref(searchStore.selectedDate || dateOptions[0].value);
const time = ref(searchStore.selectedTime || '09:00');
const duration = ref(searchStore.selectedDuration || 2);

onMounted(async () => {
  await searchStore.fetchCampuses();
  if (!campus.value && searchStore.campusOptions.length > 0) {
    campus.value = searchStore.campusOptions[0]?.value || '';
  }
});

const handleSearch = () => {
  if (!campus.value || !date.value || !time.value) {
    alert("Per favore compila tutti i campi");
    return;
  }

  searchStore.setSearchCriteria(campus.value, date.value, time.value, duration.value);
  router.push({ name: 'student-results' });
};

const goToLogin = () => {
  router.push({ name: 'login' });
};

const goToAI = () => {
  router.push({ name: 'assistant' });
};
</script>

<template>
  <div class="min-h-screen bg-brand flex flex-col relative font-sans">

    <div class="absolute top-6 right-6 z-10">
      <button
          type="button"
          @click="goToLogin"
          class="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-sm rounded-full transition-all text-white group"
          title="Admin"
      >
        <img
            src="/icons/profile_login.png"
            alt="Profile Icon"
            class="w-6 h-6 rounded-full object-cover opacity-60"
        />
      </button>
    </div>

    <main class="grow flex flex-col items-center justify-center p-4">
      <div class="w-full max-w-md">

        <div class="text-center mb-8 text-white">
          <h1 class="text-5xl font-bold mb-4 tracking-tight">AlmaSpot</h1>
          <p class="text-white/90 text-lg font-light">
            Troviamo il tuo prossimo spot.
          </p>
        </div>

        <div class="bg-white rounded-3xl shadow-2xl p-6 md:p-8 space-y-6">

          <div>
            <Dropdown :options="searchStore.campusOptions" v-model="campus" placeholder="Seleziona Campus" class="w-full"/>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <Dropdown :options="dateOptions" v-model="date" class="w-full"/>
            </div>
            <div>
              <Dropdown :options="timeOptions" v-model="time" class="w-full"/>
            </div>
          </div>

          <div>
            <DurationSelector v-model="duration" />
          </div>

          <div class="pt-2">
            <MyButton variant="primary" size="lg" class="w-full justify-center py-4 text-lg shadow-lg" :action="handleSearch">
              Cerca
            </MyButton>
          </div>

          <div class="text-center pt-1 mt-4">
            <button
                type="button"
                @click="goToAI"
                class="text-primary font-semibold hover:underline flex items-center justify-center gap-2 w-full transition-colors hover:text-red-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
              </svg>
              Chiedi un'aula all'AI
            </button>
          </div>

        </div>
      </div>
    </main>

    <footer class="py-6 text-center text-gray-400 text-sm">&copy; &copy; {{ new Date().getFullYear() }} AlmaSpot • Made for students</footer>
  </div>
</template>