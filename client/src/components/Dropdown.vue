<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

type OptionItem = { label: string; value: string | number }
type Option = string | OptionItem

type DropdownConfig = {
  options: Option[]
  modelValue?: string | number
  placeholder?: string
  isFullWidth?: boolean
  label?: string
}

const props = withDefaults(defineProps<DropdownConfig>(), {
  options: () => [],
  modelValue: '',
  placeholder: 'Seleziona...',
  isFullWidth: false,
  label: 'Dropdown options'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

const isOpen = ref(false)
const containerRef = ref<HTMLElement | null>(null)
const listboxId = 'dropdown-listbox'

const getValue = (opt: Option) => (typeof opt === 'object' ? opt.value : opt)
const getLabel = (opt: Option) => (typeof opt === 'object' ? opt.label : opt)

const toggle = () => { isOpen.value = !isOpen.value }

const select = (option: Option) => {
  emit('update:modelValue', getValue(option))
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
      class="relative"
      :class="[isFullWidth ? 'w-full' : 'inline-block']"
  >
    <button
        type="button"
        @click="toggle"
        class="
        flex items-center justify-between
        w-full px-4 py-3 h-12
        bg-ui-card
        text-base-text
        rounded-2xl
        cursor-pointer
        transition-all duration-200
        border border-transparent
        focus:outline-none focus:ring-2 focus:ring-brand
        hover:bg-gray-300
      "
        :class="{ 'ring-2 ring-brand': isOpen }"
        :aria-expanded="isOpen"
        :aria-label="props.label"
        aria-haspopup="listbox"
        :aria-controls="listboxId"
    >
      <span class="truncate">
        {{
          modelValue
              ? getLabel(options.find(o => getValue(o) === modelValue) || modelValue.toString())
              : placeholder
        }}
      </span>

      <ChevronDown
          class="w-5 h-5 ml-3 transition-transform duration-200"
          :class="{ 'rotate-180': isOpen}"
      />
    </button>

    <div
        v-if="isOpen"
        :id="listboxId"
        role="listbox"
        class="
        absolute z-50 mt-1 w-full
        bg-ui-card
        rounded-2xl shadow-xl border border-ui-border
        max-h-60 overflow-y-auto
        overflow-hidden
      "
    >
      <ul class="py-1">
        <li
            v-for="option in options"
            :key="String(getValue(option))"
            role="option"
            :aria-selected="getValue(option) === modelValue"
            @click="select(option)"
            class="
            px-5 py-3
            cursor-pointer
            text-base-text
            transition-colors duration-150
          "
            :class="{
              'font-semibold': getValue(option) === modelValue,
              'hover:bg-gray-300': getValue(option) !== modelValue
            }"
        >
          {{ getLabel(option) }}
        </li>
      </ul>
    </div>
  </div>
</template>