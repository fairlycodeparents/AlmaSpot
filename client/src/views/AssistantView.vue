<script setup lang="ts">
import { ref, nextTick, onMounted } from "vue";
import { useRouter } from "vue-router";
import ChatMessageComponent from "../components/ChatMessage.vue";
import ChatInput from "../components/ChatInput.vue";
import { assistantService } from "../services/assistant.service";
import type { ChatMessageConfig as Message } from "../components/ChatMessage.vue";
import { usePushNotifications } from "@/composables/usePushNotifications";
import { usePlanStore } from "@/stores/plan.store.ts";

const store = usePlanStore();
const route = useRouter().currentRoute;
const { campus, start, end } = route.value.query;

const isLoading = ref(false);
const scrollContainer = ref<HTMLElement | null>(null);

const router = useRouter();
const { unsubscribeFromPush } = usePushNotifications();

const messages = ref<Message[]>([
  {
    text: "Ciao! Come posso aiutarti a trovare un'aula oggi?" +
        "I parametri sono giusti? " +
        `Campus di ${campus} dalle ${start} alle ${end}?`,
    avatar: "/icons/bot-avatar.png",
    isMine: false,
  },
]);

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

  scrollToBottom();
  isLoading.value = true;

  try {
    const userMessages = messages.value
        .filter((m) => m.isMine)
        .map((m) => m.text);

    const modelMessages = messages.value
        .filter((m) => !m.isMine)
        .map((m) => m.text);

    const data = await assistantService.search(userMessages, modelMessages);
    const botResponse: Message = {
      text: data.response,
      avatar: "/icons/bot-avatar.png",
      isMine: false,
    };
    if (data.plan.length > 0) {
      botResponse.callToAction = {
        label: "Visualizza il piano",
        action: async () => {
          try {
            await unsubscribeFromPush();
            // store.setPlan({
            //   slots: data.plan.slots,
            // });
            await router.push({ name: "plan" });
          } catch (e) {
            console.error("Errore durante il cambio piano:", e);
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
    scrollToBottom();
  }
};

onMounted(() => {
  scrollToBottom();
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
