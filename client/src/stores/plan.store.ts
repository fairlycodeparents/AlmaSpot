import { defineStore } from "pinia";
import { ref, computed } from "vue";

export interface Plan {
  slots: Array<{
    roomId: string;
    start: string;
    end: string;
  }>;
}

export const usePlanStore = defineStore("plan", () => {
  const currentPlan = ref<Plan | null>(null);

  const hasPlan = computed(() => currentPlan.value !== null);
  const slots = computed(() => currentPlan.value?.slots || []);
  function setPlan(plan: Plan) {
    currentPlan.value = plan;
    localStorage.setItem("almaspot_current_plan", JSON.stringify(plan));
  }

  function clearPlan() {
    currentPlan.value = null;
    localStorage.removeItem("almaspot_current_plan");
  }

  const stored = localStorage.getItem("almaspot_current_plan");
  if (stored) {
    try {
      currentPlan.value = JSON.parse(stored);
    } catch (e) {
      console.error("Error recovering saved plan", e);
      localStorage.removeItem("almaspot_current_plan");
    }
  }

  return {
    currentPlan,
    hasPlan,
    slots,
    setPlan,
    clearPlan,
  };
});
