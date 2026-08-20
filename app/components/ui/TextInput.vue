<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  label?: string
  placeholder?: string
  supportText?: string
  disabled?: boolean
  error?: boolean
  type?: string
  autocomplete?: string
  name?: string
  autofocus?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function handleInput (event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}

const fieldClasses = computed(() => {
  if (props.disabled) return 'border-gray-100 text-gray-300'
  if (props.error) return 'border-error-400 text-gray-400'
  return 'border-gray-200 text-gray-400 focus-within:border-primary-700'
})

const placeholderClasses = computed(() => {
  if (props.disabled) return ''
  if (props.error) return 'placeholder:text-gray-800'
  return 'placeholder:text-gray-400 focus:placeholder:text-gray-800'
})

const supportTextClasses = computed(() => {
  if (props.disabled) return 'text-gray-400'
  if (props.error) return 'text-error-800'
  return 'text-gray-700'
})
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label
      v-if="label"
      class="text-input-label"
      :class="disabled ? 'text-gray-400' : 'text-gray-800'"
    >
      {{ label }}
    </label>

    <div
      class="flex h-14 items-center gap-2 rounded-xl border-[1.5px] bg-white px-4 py-3 shadow-elevation-1 transition-colors"
      :class="fieldClasses"
    >
      <slot name="leading" />
      <input
        :value="modelValue"
        :type="type ?? 'text'"
        :placeholder="placeholder"
        :disabled="disabled"
        :autocomplete="autocomplete"
        :name="name"
        :autofocus="autofocus"
        class="w-full bg-transparent text-placeholder text-black outline-none placeholder:font-dm-sans placeholder:text-[16px] placeholder:leading-6.25 placeholder:tracking-[-0.03em] disabled:text-gray-300 disabled:placeholder:text-gray-300"
        :class="placeholderClasses"
        @input="handleInput"
      />
      <slot name="trailing" />
    </div>

    <p
      v-if="supportText"
      class="text-helper-error"
      :class="supportTextClasses"
    >
      {{ supportText }}
    </p>
  </div>
</template>
