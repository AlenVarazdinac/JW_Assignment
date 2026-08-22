<script setup lang="ts">
import type { Country } from '~/types/country'

defineProps<{
  citizenship: Country
  destination: Country
  label: string
  testId?: string
}>()
</script>

<template>
  <div class="flex items-center gap-4">
    <div class="flex -space-x-2">
      <img
        :src="citizenship.flagUrl"
        :alt="`${citizenship.name} flag`"
        class="size-7 shrink-0 rounded-full object-cover ring-2 ring-white"
      />
      <img
        :src="destination.flagUrl"
        :alt="`${destination.name} flag`"
        class="size-7 shrink-0 rounded-full object-cover ring-2 ring-white"
      />
    </div>
    <div>
      <p class="text-body-xs text-gray-800">
        {{ label }}
      </p>
      <p
        class="flex items-center gap-1.5 text-button-s text-black"
        :data-testid="testId"
      >
        {{ citizenship.name }}
        <Icon
          name="custom:arrow-right"
          class="size-4.5 shrink-0"
        />
        {{ destination.name }}
      </p>
    </div>
  </div>
</template>
