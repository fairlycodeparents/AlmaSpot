<script lang="ts" setup>
import type { ButtonConfig } from './Button.vue'
import Button from './Button.vue'

type ChatMessageConfig = {
  text: string
  avatar: string
  isMine?: boolean
  callToAction?: ButtonConfig
}
withDefaults(defineProps<ChatMessageConfig>(), {
  isMine: false,
})
</script>

<template>
  <div
      class="flex items-start gap-3 mb-5 font-sans w-full"
      :class="{ 'flex-row-reverse': isMine }"
  >
    <img
        :src="avatar"
        alt="User Avatar"
        class="w-12 h-12 rounded-full object-cover shrink-0"
    />

    <div
        class="flex flex-col gap-2.5 max-w-7/10"
        :class="{ 'items-end': isMine }"
    >
      <div
          class="px-4 py-3 text-base leading-tight shadow-sm border-ui-border border text-black"
          :class="[
          isMine
            ? 'bg-ui-card rounded-xl rounded-tr-sm'
            : 'bg-white rounded-xl rounded-tl-sm'
        ]"
      >
        {{ text }}
      </div>
      <template v-if="callToAction">
        <Button v-bind="callToAction" />
      </template>
    </div>
  </div>
</template>