<script setup lang="ts">
import type { Country } from '~/types/country'

defineProps<{
  label: string
  country: Country
}>()
</script>

<template>
  <div class="flex flex-1 items-start gap-4 rounded-xl border border-gray-200 px-4 py-3">
    <img
      :src="country.flagUrl"
      :alt="`${country.name} flag`"
      class="size-8 shrink-0 rounded-full object-cover"
    />
    <div>
      <p class="text-body-xs text-gray-800">
        {{ label }}
      </p>
      <p class="mb-1 text-button-s text-black">
        {{ country.name }}
      </p>
      <p class="text-body-xs text-gray-800">
        Pop: {{ country.population.toLocaleString('en-US') }} &bull; {{ country.region }}
      </p>
      <p class="text-body-xs text-gray-800">
        {{ country.languages.join(', ') }}
      </p>
    </div>
  </div>
</template>
