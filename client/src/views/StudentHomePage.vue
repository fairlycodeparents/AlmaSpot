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
// @ts-ignore
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
// @ts-ignore
const date = ref(searchStore.selectedDate || dateOptions[0].value);
const time = ref(searchStore.selectedTime || '09:00');
const duration = ref(searchStore.selectedDuration || 2);

const errorMessage = ref('');

onMounted(async () => {
  await searchStore.fetchCampuses();
});

const handleSearch = () => {
  errorMessage.value = '';
  if (!campus.value || !date.value || !time.value) {
    errorMessage.value = "Compila tutti i campi per procedere.";
    return;
  }

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  if (date.value === todayStr) {
    const currentHour = now.getHours();
    // @ts-ignore
    const selectedHour = parseInt(time.value.split(':')[0], 10);
    if (currentHour > selectedHour) {
      errorMessage.value = "Orario già passato! Seleziona un'ora valida.";
      return;
    }
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
  <div class="min-h-screen bg-brand flex flex-col relative">

    <div class="absolute top-6 right-6 z-10">
      <button
          type="button"
          @click="goToLogin"
          class="flex items-center gap-2 px-4 py-2"
          title="Admin">
        <img
            src="/icons/profile_login.png"
            alt="Profile Icon"
            class="w-8 h-8"
        />
      </button>
    </div>

    <header class="pt-12">
      <span
          class="text-brand-text font-semibold text-lg tracking-wide opacity-90"
      >AlmaSpot</span
      >
    </header>

    <main class="grow flex flex-col items-center justify-center p-4">
      <div class="w-full max-w-md">
        <h1 class="text-4xl font-bold text-brand-text text-center leading-tight">
          Troviamo il tuo prossimo spot.
        </h1>

        <div class="bg-white w-full rounded-2xl shadow-2xl p-6 md:p-8 space-y-5 grow md:grow-0">

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

          <div v-if="errorMessage" class="text-red-500 text-sm text-center animate-pulse bg-red-50 p-2">
            ⚠️ {{ errorMessage }}
          </div>

          <div class="pt-2">
            <MyButton variant="primary" size="lg" class="w-full font-bold justify-center py-4 text-lg shadow-lg" :action="handleSearch" label="Cerca">
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

    <footer class="py-6 text-center text-white text-sm">&copy; {{ new Date().getFullYear() }} AlmaSpot • Made for students</footer>
  </div>
</template>