<script setup lang="ts">
import type { Country } from '~/types/country'

const props = defineProps<{
  modelValue: Country | null
  countries: Country[]
  label: string
  excludeCca2?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Country | null]
}>()

const search = ref('')
const isOpen = ref(false)
const rootEl = ref<HTMLElement | null>(null)

const filteredCountries = computed(() => {
  const query = search.value.trim().toLowerCase()

  return props.countries
    .filter(country => country.cca2 !== props.excludeCca2)
    .filter(country => !query || country.name.toLowerCase().includes(query))
})

function selectCountry (country: Country) {
  emit('update:modelValue', country)
  search.value = ''
  isOpen.value = false
}

function handleClickOutside (event: MouseEvent) {
  if (rootEl.value && !rootEl.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<template>
  <div
    ref="rootEl"
    class="country-select"
  >
    <label class="country-select__label">{{ label }}</label>

    <button
      type="button"
      class="country-select__trigger"
      @click="isOpen = !isOpen"
    >
      <template v-if="modelValue">
        <img
          :src="modelValue.flagUrl"
          :alt="`${modelValue.name} flag`"
          class="country-select__flag"
        />
        <span class="country-select__name">{{ modelValue.name }}</span>
        <span class="country-select__capital">{{ modelValue.capital || '—' }}</span>
      </template>
      <span
        v-else
        class="country-select__placeholder"
      >Select a country</span>
    </button>

    <div
      v-if="isOpen"
      class="country-select__panel"
    >
      <input
        v-model="search"
        type="text"
        placeholder="Search country..."
        class="country-select__search"
        autofocus
      />

      <ul class="country-select__list">
        <li
          v-if="filteredCountries.length === 0"
          class="country-select__empty"
        >
          No countries found
        </li>
        <li
          v-for="country in filteredCountries"
          :key="country.cca2"
          class="country-select__option"
          @click="selectCountry(country)"
        >
          <img
            :src="country.flagUrl"
            :alt="`${country.name} flag`"
            class="country-select__flag"
          />
          <span class="country-select__name">{{ country.name }}</span>
          <span class="country-select__capital">{{ country.capital || '—' }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.country-select {
  position: relative;
  width: 320px;
}

.country-select__label {
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.country-select__trigger {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
  background: white;
  text-align: left;
  cursor: pointer;
}

.country-select__placeholder {
  color: #888;
}

.country-select__name {
  flex: 1;
}

.country-select__flag {
  width: 20px;
  height: 15px;
  object-fit: cover;
  flex-shrink: 0;
}

.country-select__capital {
  color: #888;
  font-size: 0.875rem;
}

.country-select__panel {
  position: absolute;
  z-index: 10;
  top: calc(100% + 0.25rem);
  left: 0;
  right: 0;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.country-select__search {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: none;
  border-bottom: 1px solid #eee;
  outline: none;
}

.country-select__list {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 240px;
  overflow-y: auto;
}

.country-select__option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
}

.country-select__option:hover {
  background: #f5f5f5;
}

.country-select__empty {
  padding: 0.75rem;
  color: #888;
  text-align: center;
}
</style>
