import { ref, computed, watch, type Ref } from "vue";

export function useTimeSlots(dateRef: Ref<string>) {
  const fullTimeSlots = Array.from({ length: 11 }, (_, i) => {
    const hour = (i + 9).toString().padStart(2, "0");
    return `${hour}:00`;
  });

  const availableTimeOptions = computed(() => {
    if (dateRef.value === "Domani") {
      return fullTimeSlots;
    }

    const now = new Date();
    const currentHour = now.getHours();

    return fullTimeSlots.filter((timeSlot) => {
      const slotHour = parseInt(timeSlot.split(":")[0] || "0");
      return slotHour > currentHour;
    });
  });

  const getInitialTime = () => {
    return availableTimeOptions.value[0] || "09:00";
  };

  const time = ref(getInitialTime());

  watch(dateRef, () => {
    if (!availableTimeOptions.value.includes(time.value)) {
      time.value = getInitialTime();
    }
  });

  return {
    time,
    availableTimeOptions,
  };
}
