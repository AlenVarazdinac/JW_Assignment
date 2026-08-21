<script setup lang="ts">
import type { Country } from '~/types/country'

defineProps<{
  modelValue: Country | null
  countries: Country[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Country | null]
}>()
</script>

<template>
  <UiDropdownSelect
    :model-value="modelValue"
    :countries="countries"
    panel-class="w-64"
    class="shrink-0"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template #trigger="{ toggle }">
      <button
        type="button"
        class="flex cursor-pointer items-center gap-1.5 text-placeholder text-black"
        @click="toggle"
      >
        <img
          v-if="modelValue"
          :src="modelValue.flagUrl"
          :alt="`${modelValue.name} flag`"
          class="size-5 shrink-0 rounded-full object-cover"
        />
        <span>{{ modelValue?.callingCode ?? '+--' }}</span>
      </button>
    </template>

    <template #row="{ country }">
      <span class="flex-1 truncate">{{ country.name }}</span>
      <span class="text-body-xs text-gray-400">{{ country.callingCode }}</span>
    </template>
  </UiDropdownSelect>
</template>
