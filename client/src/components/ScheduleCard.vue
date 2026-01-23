<script setup lang="ts">
interface ScheduleCardConfig {
  startTime: string;
  endTime: string;
  roomName: string;
  campusName: string;
  address: string;
}
defineProps<ScheduleCardConfig>();
</script>

<template>
  <div class="flex w-full max-w-md gap-4">
    <div class="flex flex-col items-center justify-between shrink-0 w-14">
      <span class="font-bold text-base-text leading-none">
        {{ startTime }}
      </span>

      <div class="w-0.75 bg-base-text grow my-1 rounded-full"></div>

      <span class="font-bold text-base-text leading-none">
        {{ endTime }}
      </span>
    </div>

    <div
      class="bg-base-grey rounded-3xl p-6 w-full flex flex-col justify-center shadow-sm"
    >
      <h4 class="text-4xl font-bold text-base-text mb-1 leading-tight">
        {{ roomName }}
      </h4>

      <p class="text-base-text leading-snug">
        {{ campusName }}
      </p>

      <p class="text-base-text mt-1 leading-snug">
        {{ address }}
      </p>
    </div>
  </div>
</template>
