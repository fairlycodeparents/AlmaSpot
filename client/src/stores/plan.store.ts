import { defineStore } from "pinia";
import { ref, computed } from "vue";

export interface Plan {
  id: string;
  slots: Array<{
    id: string;
    name: string;
    type: string;
    campus: string;
    address: string;
    from: string;
    to: string;
  }>;
}

export const usePlanStore = defineStore("plan", () => {
  const currentPlan = ref<Plan | null>(null);
  const subscribedPlan = ref<Plan | null>(null);

  const hasPlan = computed(() => currentPlan.value !== null);
  const slots = computed(() => currentPlan.value?.slots || []);
  function setPlan(plan: Plan) {
    currentPlan.value = plan;
    localStorage.setItem("almaspot_current_plan", JSON.stringify(plan));
  }

  function markAsSubscribed() {
    if (currentPlan.value) {
      subscribedPlan.value = JSON.parse(JSON.stringify(currentPlan.value)); // Copia profonda
      localStorage.setItem(
        "almaspot_subscribed_plan",
        JSON.stringify(subscribedPlan.value),
      );
    }
  }

  function clearSubscriptionData() {
    subscribedPlan.value = null;
    localStorage.removeItem("almaspot_subscribed_plan");
  }

  function restoreSubscribedPlan() {
    if (subscribedPlan.value) {
      currentPlan.value = JSON.parse(JSON.stringify(subscribedPlan.value));
      localStorage.setItem(
        "almaspot_current_plan",
        JSON.stringify(currentPlan.value),
      );
    }
  }

  const storedCurrent = localStorage.getItem("almaspot_current_plan");
  if (storedCurrent) {
    try {
      currentPlan.value = JSON.parse(storedCurrent);
    } catch (e) {
      console.error(e);
    }
  }

  const storedSubscribed = localStorage.getItem("almaspot_subscribed_plan");
  if (storedSubscribed) {
    try {
      subscribedPlan.value = JSON.parse(storedSubscribed);
    } catch (e) {
      console.error(e);
    }
  }

  return {
    currentPlan,
    subscribedPlan,
    hasPlan,
    slots,
    setPlan,
    markAsSubscribed,
    clearSubscriptionData,
    restoreSubscribedPlan,
  };
});
