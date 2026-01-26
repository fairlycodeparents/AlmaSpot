import { ref, computed, watch, type Ref } from "vue";

interface TimeSlotOptions {
  includeCurrentHour?: boolean;
}

export function useTimeSlots(
  dateRef: Ref<string>,
  options: TimeSlotOptions = { includeCurrentHour: false },
) {
  const fullTimeSlots = Array.from({ length: 11 }, (_, i) => {
    const hour = (i + 9).toString().padStart(2, "0");
    return `${hour}:00`;
  });

  const isToday = computed(() => {
    const val = dateRef.value;
    if (val === "Oggi") return true;
    if (val === "Domani") return false;

    const todayIso = new Date().toISOString().split("T")[0];
    return val === todayIso;
  });

  const availableTimeOptions = computed(() => {
    if (!isToday.value) {
      return fullTimeSlots;
    }

    const now = new Date();
    const currentHour = now.getHours();

    return fullTimeSlots.filter((timeSlot) => {
      const slotHour = parseInt(timeSlot.split(":")[0] || "0");
      if (options.includeCurrentHour) {
        return slotHour >= currentHour;
      } else {
        return slotHour > currentHour;
      }
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
