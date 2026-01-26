import { usePlanStore } from "@/stores/plan.store.ts";
import { usePushNotifications } from "@/composables/usePushNotifications";
import type { Router } from "vue-router";

/**
 * Composable to manage plan session activation.
 */
export function usePlanSession() {
  const store = usePlanStore();
  const { unsubscribeFromPush } = usePushNotifications();

  /**
   * Actives a plan by saving it to the store and navigating to the plan page.
   * @param router the router instance for navigation
   * @param slots the slots to be saved in the plan
   */
  const activatePlan = async (router: Router, slots: any[]) => {
    try {
      await unsubscribeFromPush();
      store.setPlan({
        slots: slots,
      });
      await router.push({ name: "plan" });
    } catch (e) {
      console.error("Error while changing plan:", e);
      await router.push({ name: "plan" });
    }
  };

  return {
    activatePlan,
  };
}
