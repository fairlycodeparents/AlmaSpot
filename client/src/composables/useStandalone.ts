import { ref, onMounted } from "vue";

export function useStandalone() {
  const isStandalone = ref(false);

  const check = () => {
    isStandalone.value =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
  };

  onMounted(() => {
    check();
    window
      .matchMedia("(display-mode: standalone)")
      .addEventListener("change", check);
  });

  return { isStandalone };
}
