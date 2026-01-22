<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

type DropdownConfig = {
  options: string[]
  modelValue?: string
  placeholder?: string
  isFullWidth?: boolean
  label?: string
}

withDefaults(defineProps<DropdownConfig>(), {
  options: () => [],
  modelValue: '',
  placeholder: 'Select...',
  isFullWidth: false,
  label: 'Options menu'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const isOpen = ref(false)
const containerRef = ref<HTMLElement | null>(null)

const toggle = () => { isOpen.value = !isOpen.value }

const select = (option: string) => {
  emit('update:modelValue', option)
  isOpen.value = false
}

const handleClickOutside = (e: MouseEvent) => {
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<template>
  <div
      ref="containerRef"
      class="relative text-base"
      :class="[isFullWidth ? 'w-full' : 'min-w-16 inline-block']"
  >
    <button
        type="button"
        @click="toggle"
        class="
        flex items-center justify-between
        w-full px-5 py-3
        bg-base-grey hover:bg-ui-card
        text-base-text font-medium
        rounded-2xl
        cursor-pointer
        transition-colors duration-200
      "
    >
      <span v-if="modelValue" class="truncate">{{ modelValue }}</span>
      <span v-else class="truncate">{{ placeholder }}</span>

      <img
          src="/icons/chevron-down.svg"
          alt=""
          class="w-5 h-5 ml-3"
          :class="{ 'rotate-180': isOpen }"
          aria-hidden="true"
      />
    </button>

    <div
        v-if="isOpen"
        role="listbox"
        class="
        absolute z-50 mt-2 w-full
        bg-base-grey
        rounded-2xl shadow-lg border border-ui-border
        max-h-60 overflow-y-auto
      "
    >
      <ul>
        <li
            v-for="option in options"
            :key="option"
            role="option"
            :aria-selected="option === modelValue"
            @click="select(option)"
            class="
            px-5 py-2.5
            cursor-pointer
            text-base-text
            transition-colors duration-150
          "
            :class="{
              'bg-base-background': option === modelValue,
              'hover:bg-ui-border': option !== modelValue
            }"
        >
          {{ option }}
        </li>
      </ul>
    </div>
  </div>
</template>