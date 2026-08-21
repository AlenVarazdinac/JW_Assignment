<script setup lang="ts">
import type { Country } from '~/types/country'

const props = withDefaults(
  defineProps<{
    modelValue: Country | null
    countries: Country[]
    excludeCca2?: string
    panelClass?: string
  }>(),
  {
    panelClass: 'w-full'
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: Country | null]
}>()

const { search, isOpen, rootEl, searchInputEl, filteredCountries, clearSearch, close }
  = useCountrySearch(() => props.countries, () => props.excludeCca2)

function toggle () {
  isOpen.value = !isOpen.value
}

function selectCountry (country: Country) {
  emit('update:modelValue', country)
  close()
}
</script>

<template>
  <div
    ref="rootEl"
    class="relative"
  >
    <slot
      name="trigger"
      :toggle="toggle"
    />

    <div
      v-if="isOpen"
      class="absolute top-full left-0 z-10 mt-1 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-elevation-3"
      :class="panelClass"
    >
      <div class="flex items-center gap-2 border-b border-gray-100 bg-gray-25 px-4 py-3">
        <Icon
          name="custom:search"
          class="size-5 shrink-0 text-gray-400"
        />
        <input
          ref="searchInputEl"
          v-model="search"
          type="text"
          placeholder="Search country..."
          class="w-full bg-transparent text-placeholder text-black outline-none placeholder:text-gray-400"
        />
        <button
          v-if="search"
          type="button"
          aria-label="Clear search"
          class="flex size-5 shrink-0 cursor-pointer items-center justify-center text-lg leading-none text-gray-400 hover:text-gray-700"
          @click.stop="clearSearch"
        >
          ×
        </button>
      </div>

      <ul class="max-h-60 overflow-y-auto">
        <li
          v-if="filteredCountries.length === 0"
          class="px-4 py-3 text-body-s text-gray-400"
        >
          No countries found
        </li>
        <li
          v-for="country in filteredCountries"
          :key="country.cca2"
          class="flex cursor-pointer items-center gap-2 px-4 py-2.5 text-placeholder text-black hover:bg-gray-50"
          @click="selectCountry(country)"
        >
          <img
            :src="country.flagUrl"
            :alt="`${country.name} flag`"
            loading="lazy"
            class="size-5 shrink-0 rounded-full object-cover"
          />
          <slot
            name="row"
            :country="country"
          />
        </li>
      </ul>
    </div>
  </div>
</template>
