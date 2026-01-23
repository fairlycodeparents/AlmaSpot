<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import AlertCard from "@/components/AlertCard.vue";
import ScheduleCard from "@/components/ScheduleCard.vue";
import Button from "@/components/Button.vue";
import {usePushNotifications} from "@/composables/usePushNotifications.ts";

const route = useRoute();
const showAlert = ref(false);
const alertData = ref({ intro: "", message: "", timeSlot: "" });

const {
  subscribeToPush,
  isSubscribed,
  isLoading,
  error,
  isSupported
} = usePushNotifications();

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

function handleEnableNotifications() {
  if (isLoading.value || isSubscribed.value) return;

  const fakePlan = {
    slots: [
      {
        roomId: "AulaMagna",
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 3600000).toISOString(),
      },
    ],
  };
  subscribeToPush(fakePlan)
}
</script>

<template>
  <div class="min-h-screen bg-brand flex flex-col">

    <header class="h-[35vh] min-h-62.5 px-6 pb-12 shrink-0 flex flex-col justify-end">
      <h1 class="text-brand-text font-bold tracking-wide text-4xl">
        Il tuo piano
      </h1>
    </header>

    <main class="flex-1 bg-white rounded-t-[3rem] relative">
      <div class="w-full max-w-lg mx-auto flex flex-col px-6 py-8 pb-32">

        <div v-if="error" class="mb-4 p-3 bg-base-background text-brand rounded-lg text-sm text-center">
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
          <ScheduleCard
              start-time="17:00"
              end-time="18:00"
              room-name="Aula 3.4"
              campus-name="Cesena"
              address="Via dell'Università, 50"
          />
          <ScheduleCard
              start-time="18:00"
              end-time="19:00"
              room-name="Laboratorio Informatico"
              campus-name="Rimini"
              address="Viale Carlo Tonini, 34"
          />
          <ScheduleCard
              start-time="19:00"
              end-time="20:00"
              room-name="Aula Magna"
              campus-name="Bologna"
              address="Via Zamboni, 33"
          />
        </div>
      </div>

      <template v-if="isSupported">
        <div class="fixed left-0 right-0 bottom-8 flex justify-center z-50 pointer-events-none">
          <div class="pointer-events-auto">
            <Button
                :label="isSubscribed ? 'Notifiche Attive' : (isLoading ? 'Attivazione...' : 'Attiva le notifiche')"
                :icon="{
                      src: isSubscribed ? '/icons/notifications.svg' : '/icons/notification_add.svg',
                      alt: 'Icona notifica'
                    }"
                :action="handleEnableNotifications"
                :is-full-width="false"
                :isIconRight="false"
                :class="{ 'opacity-75 cursor-not-allowed': isLoading || isSubscribed }"
            />
          </div>
        </div>
      </template>

      <div v-else class="bg-base-grey text-brand-text px-6 py-3 rounded-full font-medium">
        Notifiche non supportate
      </div>

    </main>
  </div>
</template>