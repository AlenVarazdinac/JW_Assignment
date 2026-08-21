import type { Country } from '~/types/country'

export function useCountrySearch (getCountries: () => Country[], getExcludeCca2?: () => string | undefined) {
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
    const exclude = getExcludeCca2?.()

    return getCountries()
      .filter(country => country.cca2 !== exclude)
      .filter(country => !query || country.name.toLowerCase().includes(query))
  })

  function clearSearch () {
    search.value = ''
    searchInputEl.value?.focus()
  }

  function close () {
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

  return { search, isOpen, rootEl, searchInputEl, filteredCountries, clearSearch, close }
}
