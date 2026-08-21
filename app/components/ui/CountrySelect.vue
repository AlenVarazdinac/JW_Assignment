<script setup lang="ts">
import type { Country } from '~/types/country'

const props = defineProps<{
  modelValue: Country | null
  countries: Country[]
  label: string
  excludeCca2?: string
  supportText?: string
  error?: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Country | null]
}>()

const triggerId = useId()

const fieldClasses = computed(() => {
  if (props.disabled) return 'border-gray-100 text-gray-300'
  if (props.error) return 'border-error-400 text-gray-400'
  return 'border-gray-200 text-gray-400 focus-within:border-primary-700'
})

const supportTextClasses = computed(() => {
  if (props.disabled) return 'text-gray-400'
  if (props.error) return 'text-error-800'
  return 'text-gray-700'
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <label
      :for="triggerId"
      class="text-input-label"
      :class="disabled ? 'text-gray-400' : 'text-gray-800'"
    >
      {{ label }}
    </label>

    <UiDropdownSelect
      :model-value="modelValue"
      :countries="countries"
      :exclude-cca2="excludeCca2"
      @update:model-value="emit('update:modelValue', $event)"
    >
      <template #trigger="{ toggle }">
        <label
          :for="triggerId"
          class="flex h-14 w-full items-center gap-2 rounded-xl border-[1.5px] bg-white px-4 py-3 shadow-elevation-1 transition-colors"
          :class="fieldClasses"
        >
          <button
            :id="triggerId"
            type="button"
            :disabled
            class="flex flex-1 cursor-pointer items-center gap-2 text-left disabled:cursor-not-allowed"
            @click="toggle"
          >
            <template v-if="modelValue">
              <img
                :src="modelValue.flagUrl"
                :alt="`${modelValue.name} flag`"
                class="size-5 shrink-0 rounded-full object-cover"
              />
              <span class="flex-1 truncate text-placeholder text-black">{{ modelValue.name }}</span>
              <span class="text-body-xs text-gray-400">{{ modelValue.capital || '-' }}</span>
            </template>
            <span
              v-else
              class="flex-1 text-placeholder text-gray-400"
            >Select a country...</span>
          </button>

          <button
            v-if="modelValue && !disabled"
            type="button"
            aria-label="Clear selection"
            class="flex size-5 shrink-0 cursor-pointer items-center justify-center text-gray-400 hover:text-gray-700"
            @click.stop="emit('update:modelValue', null)"
          >
            <Icon
              name="custom:close-circle"
              class="size-5"
            />
          </button>
          <Icon
            v-else
            name="custom:search"
            class="size-5 shrink-0"
          />
        </label>
      </template>

      <template #row="{ country }">
        <span class="flex-1 truncate">{{ country.name }}</span>
        <span class="text-body-xs text-gray-400">{{ country.capital || '-' }}</span>
      </template>
    </UiDropdownSelect>

    <p
      v-if="supportText"
      class="text-helper-error"
      :class="supportTextClasses"
    >
      {{ supportText }}
    </p>
  </div>
</template>
