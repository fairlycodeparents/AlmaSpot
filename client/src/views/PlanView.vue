<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, onBeforeRouteLeave } from "vue-router";
import AlertCard from "@/components/AlertCard.vue";
import ScheduleCard from "@/components/ScheduleCard.vue";
import Button from "@/components/Button.vue";
import { usePushNotifications } from "@/composables/usePushNotifications.ts";
import { usePlanStore } from "@/stores/plan.store.ts";

const route = useRoute();
const planStore = usePlanStore();

const showAlert = ref(false);
const alertData = ref({ intro: "", message: "", timeSlot: "" });

const {
  subscribeToPush,
  unsubscribeFromPush,
  isSubscribed,
  isLoading,
  error,
  isSupported,
} = usePushNotifications();

const slots = computed(() => planStore.slots);
const hasPlan = computed(() => planStore.hasPlan);

function formatTime(isoString: string): string {
  if (!isoString) return "--:--";
  const date = new Date(isoString);
  return date.toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

onMounted(() => {
  if (route.query.alert === "true") {
    showAlert.value = true;
    alertData.value = {
      intro: "C’è stato un problema con il tuo piano:",
      message: "Una nuova attività si sovrappone al tuo studio delle",
      timeSlot: (route.query.timeSlot as string) || "",
    };
  }
});

async function handleNotificationToggle() {
  if (isLoading.value) return;

  if (isSubscribed.value) {
    if (confirm("Vuoi disattivare le notifiche per questo dispositivo?")) {
      await unsubscribeFromPush();
    }
  } else {
    if (planStore.currentPlan && planStore.slots.length > 0) {
      await subscribeToPush(planStore.currentPlan);
    } else {
      console.warn("No plan available for notifications.");
      alert("Nessun piano disponibile per le notifiche.");
    }
  }
}

onBeforeRouteLeave((to, from) => {
  if (to.name === "home" || to.path === "/") {
    return true;
  }
  return { name: "home" };
});
</script>

<template>
  <div class="min-h-screen bg-brand flex flex-col">
    <header
      class="h-[35vh] min-h-62.5 px-6 pb-12 shrink-0 flex flex-col justify-end"
    >
      <h1 class="text-brand-text font-bold tracking-wide text-4xl">
        Il tuo piano
      </h1>
    </header>

    <main class="flex-1 bg-base-background rounded-t-[3rem] relative">
      <div class="w-full max-w-lg mx-auto flex flex-col px-6 py-8 pb-32">
        <div
          v-if="error"
          class="mb-4 p-3 bg-base-background text-brand rounded-lg text-sm text-center"
        >
          Si è verificato un errore: {{ error }}
        </div>

        <div v-if="showAlert" class="mb-8 w-full">
          <AlertCard
            :intro="alertData.intro"
            :message="alertData.message"
            :time-slot="alertData.timeSlot"
          />
        </div>

        <div class="flex flex-col gap-6 w-full text-base-text">
          <template v-if="hasPlan">
            <ScheduleCard
              v-for="(slot, index) in slots"
              :key="index"
              :start-time="formatTime(slot.from)"
              :end-time="formatTime(slot.to)"
              :room-name="slot.name"
              :campus-name="slot.campus"
              :address="slot.address"
            />
          </template>

          <div
            v-else
            class="text-center py-12 text-base-text flex flex-col items-center gap-4"
          >
            <p>Non hai ancora generato un piano.</p>
            <RouterLink
              to="/"
              class="text-brand font-bold hover:text-brand-dark hover:underline"
            >
              Genera il tuo piano ora!
            </RouterLink>
          </div>
        </div>
      </div>

      <template v-if="isSupported && hasPlan">
        <div
          class="fixed left-0 right-0 bottom-8 flex justify-center z-50 pointer-events-none"
        >
          <div class="pointer-events-auto">
            <Button
              :label="
                isSubscribed
                  ? 'Notifiche Attive'
                  : isLoading
                    ? 'Attivazione...'
                    : 'Attiva le notifiche'
              "
              :icon="{
                src: isSubscribed
                  ? '/icons/notifications.svg'
                  : '/icons/notification_add.svg',
                alt: 'Icona notifica',
              }"
              :action="handleNotificationToggle"
              :is-full-width="false"
              :isIconRight="false"
              :class="{
                'opacity-75 cursor-not-allowed': isLoading || isSubscribed,
              }"
            />
          </div>
        </div>
      </template>

      <div
        v-else-if="!isSupported && hasPlan"
        class="fixed bottom-8 left-0 right-0 flex justify-center pointer-events-none"
      >
        <div
          class="inline-flex items-center justify-center rounded-full font-medium cursor-not-allowed select-none px-6 py-3 bg-base-text/12 text-base-text/38"
          role="status"
          aria-label="Le notifiche non sono supportate"
        >
          Notifiche non supportate
        </div>
      </div>
    </main>
  </div>
</template>
