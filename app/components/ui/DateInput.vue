<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  label?: string
  placeholder?: string
  supportText?: string
  error?: boolean
  disabled?: boolean
  name?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const isOpen = ref(false)
const rootEl = ref<HTMLElement | null>(null)

function isoToDisplay (iso: string): string {
  if (!iso) return ''
  const [year, month, day] = iso.split('-')
  return `${day}/${month}/${year}`
}

function parseDisplayToISO (display: string): string | null {
  const match = display.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!match) return null
  const [, dd, mm, yyyy] = match
  const month = Number(mm)
  const day = Number(dd)
  const year = Number(yyyy)
  const date = new Date(year, month - 1, day)
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null
  return `${yyyy}-${mm}-${dd}`
}

function formatDigits (raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8)
  const dd = digits.slice(0, 2)
  const mm = digits.slice(2, 4)
  const yyyy = digits.slice(4, 8)
  let result = dd
  if (digits.length > 2) result += `/${mm}`
  if (digits.length > 4) result += `/${yyyy}`
  return result
}

const rawText = ref(isoToDisplay(props.modelValue))

watch(() => props.modelValue, (value) => {
  rawText.value = isoToDisplay(value)
})

function handleTextInput (value: string) {
  rawText.value = formatDigits(value)

  if (!rawText.value) {
    emit('update:modelValue', '')
    return
  }

  const iso = parseDisplayToISO(rawText.value)
  if (iso) emit('update:modelValue', iso)
}

function handleBlur () {
  if (rawText.value && !parseDisplayToISO(rawText.value)) {
    emit('update:modelValue', '')
  }
}

function toggle () {
  if (props.disabled) return
  isOpen.value = !isOpen.value
}

function close () {
  isOpen.value = false
}

function handleSelect (value: string) {
  emit('update:modelValue', value)
  close()
}

useClickOutside(rootEl, close)
</script>

<template>
  <div
    ref="rootEl"
    class="relative"
  >
    <UiTextInput
      :model-value="rawText"
      :label="label"
      :placeholder="placeholder ?? 'dd/mm/yyyy'"
      :support-text="supportText"
      :error="error"
      :disabled="disabled"
      :name="name"
      @update:model-value="handleTextInput"
      @blur="handleBlur"
    >
      <template #trailing>
        <button
          type="button"
          :disabled
          aria-label="Open calendar"
          class="flex size-5 shrink-0 cursor-pointer items-center justify-center text-gray-400 hover:text-gray-700 disabled:cursor-not-allowed"
          @click.stop="toggle"
        >
          <Icon
            name="custom:calendar-search"
            class="size-5"
          />
        </button>
      </template>
    </UiTextInput>

    <UiCalendar
      v-if="isOpen"
      :model-value="modelValue"
      class="absolute top-full left-0 z-10 mt-1"
      @update:model-value="handleSelect"
    />
  </div>
</template>
