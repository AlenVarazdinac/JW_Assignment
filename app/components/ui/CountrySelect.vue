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

const search = ref('')
const isOpen = ref(false)
const rootEl = ref<HTMLElement | null>(null)
const searchInputEl = ref<HTMLInputElement | null>(null)

watch(isOpen, async (open) => {
  if (!open) return
  await nextTick()
  searchInputEl.value?.focus()
})

const filteredCountries = computed(() => {
  const query = search.value.trim().toLowerCase()

  return props.countries
    .filter(country => country.cca2 !== props.excludeCca2)
    .filter(country => !query || country.name.toLowerCase().includes(query))
})

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

function selectCountry (country: Country) {
  emit('update:modelValue', country)
  search.value = ''
  isOpen.value = false
}

function clearSearch () {
  search.value = ''
  searchInputEl.value?.focus()
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
    class="flex flex-col gap-1.5"
  >
    <label
      class="text-input-label"
      :class="disabled ? 'text-gray-400' : 'text-gray-800'"
    >
      {{ label }}
    </label>

    <div class="relative">
      <button
        type="button"
        :disabled
        class="flex h-14 w-full items-center gap-2 rounded-xl border-[1.5px] bg-white px-4 py-3 text-left shadow-elevation-1 transition-colors disabled:cursor-not-allowed"
        :class="fieldClasses"
        @click="isOpen = !isOpen"
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
        <Icon
          name="custom:search"
          class="size-5 shrink-0"
        />
      </button>

      <div
        v-if="isOpen"
        class="absolute top-full left-0 z-10 mt-1 w-full overflow-hidden rounded-xl border border-gray-100 bg-white shadow-elevation-3"
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
            class="flex size-5 shrink-0 items-center justify-center text-lg leading-none text-gray-400 hover:text-gray-700 cursor-pointer"
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
              class="size-5 shrink-0 rounded-full object-cover"
            />
            <span class="flex-1 truncate">{{ country.name }}</span>
            <span class="text-body-xs text-gray-400">{{ country.capital || '-' }}</span>
          </li>
        </ul>
      </div>
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
