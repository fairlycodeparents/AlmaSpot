<script setup lang="ts">
import { ref, nextTick, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import ChatMessageComponent from "../components/ChatMessage.vue";
import ChatInput from "../components/ChatInput.vue";
import {
  assistantService,
  type AssistantSlot,
  type ChatMessage,
} from "../services/assistant.service";
import type { ChatMessageConfig as Message } from "../components/ChatMessage.vue";
import { usePlanSession } from "@/composables/usePlanSession.ts";

const router = useRouter();
const route = useRoute();
const { activatePlan } = usePlanSession();
const messages = ref<Message[]>([]);
const isLoading = ref(false);
const scrollContainer = ref<HTMLElement | null>(null);

const scrollToBottom = async () => {
  await nextTick();
  if (scrollContainer.value) {
    scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
  }
};

const handleSendMessage = async (text: string) => {
  messages.value.push({
    text,
    isMine: true,
  });

  await scrollToBottom();
  isLoading.value = true;

  try {
    const history: ChatMessage[] = messages.value.map((msg) => ({
      role: msg.isMine ? "user" : "model",
      content: msg.text,
    }));

    const data = await assistantService.search(history);
    const botResponse: Message = {
      text: data.response,
      avatar: "/icons/bot-avatar.png",
      isMine: false,
    };

    if (data.plan && data.plan.length > 0) {
      const plan = data.plan;
      botResponse.callToAction = {
        label: "Visualizza il piano",
        action: async () => {
          try {
            const sanitizedPlan = plan.map((slot: any) => {
              const aiDateFrom = new Date(slot.from);
              const aiDateTo = new Date(slot.to);
              const localFrom = new Date(
                aiDateFrom.getUTCFullYear(),
                aiDateFrom.getUTCMonth(),
                aiDateFrom.getUTCDate(),
                aiDateFrom.getUTCHours(),
                aiDateFrom.getUTCMinutes(),
              );
              const localTo = new Date(
                aiDateTo.getUTCFullYear(),
                aiDateTo.getUTCMonth(),
                aiDateTo.getUTCDate(),
                aiDateTo.getUTCHours(),
                aiDateTo.getUTCMinutes(),
              );
              return {
                ...slot,
                from: localFrom.toISOString(),
                to: localTo.toISOString(),
              };
            });
            await activatePlan(router, sanitizedPlan as AssistantSlot[]);
            await router.push({ name: "plan" });
          } catch (error) {
            console.error("Errore durante il cambio piano:", error);
            await router.push({ name: "plan" });
          }
        },
        icon: {
          src: "/icons/arrow-right.svg",
          alt: "Vedi dettagli",
        },
        isFullWidth: true,
      };
    }

    messages.value.push(botResponse);
  } catch (error) {
    messages.value.push({
      text:
        error instanceof Error ? error.message : "Si è verificato un errore.",
      avatar: "/icons/bot-avatar.png",
      isMine: false,
    });
  } finally {
    isLoading.value = false;
    await scrollToBottom();
  }
};

onMounted(async () => {
  const { campus, date, start, duration } = route.query;
  if (campus && date && start && duration) {
    const autoQuery =
      "Vorrei trovare un'aula oggi" +
      (campus ? ` nel campus di ${campus}` : "") +
      (date ? ` il ${date}` : "") +
      (start ? ` dalle ${start}` : "") +
      (duration ? ` per ${duration} ore` : "");
    await handleSendMessage(autoQuery);
  } else {
    messages.value.push({
      text: "Ciao! Come posso aiutarti a trovare un'aula oggi?",
      avatar: "/icons/bot-avatar.png",
      isMine: false,
    });
    await scrollToBottom();
  }
});
</script>

<template>
  <div class="flex flex-col h-screen bg-base-background max-w-5xl mx-auto">
    <header class="shrink-0 py-6 text-center bg-base-background z-10">
      <h1 class="text-brand text-4xl font-bold">Assistente</h1>
    </header>

    <main
      ref="scrollContainer"
      class="flex-1 overflow-y-auto px-4 py-6 space-y-2 scroll-smooth"
    >
      <ChatMessageComponent
        v-for="(msg, index) in messages"
        :key="index"
        :text="msg.text"
        :avatar="msg.avatar || ''"
        :is-mine="msg.isMine"
        :call-to-action="msg.callToAction"
      />

      <div v-if="isLoading" class="flex items-start gap-3 mb-5 w-full">
        <img
          src="/icons/bot-avatar.png"
          alt="Bot"
          class="w-12 h-12 rounded-full object-cover opacity-60"
        />
        <div
          class="bg-base-background rounded-2xl rounded-tl-sm p-4 flex items-center gap-1 h-12 border border-ui-border animate-pulse"
        >
          <div class="w-2 h-2 bg-base-text rounded-full animate-bounce"></div>
          <div class="w-2 h-2 bg-base-text rounded-full animate-bounce"></div>
          <div class="w-2 h-2 bg-base-text rounded-full animate-bounce"></div>
        </div>
      </div>
    </main>

    <footer class="shrink-0 p-4">
      <ChatInput
        placeholder="Chiedi all'assistente..."
        :disabled="isLoading"
        @send="handleSendMessage"
      />
    </footer>
  </div>
</template>
