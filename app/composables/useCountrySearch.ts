import Fuse from 'fuse.js'
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

  const availableCountries = computed(() => {
    const exclude = getExcludeCca2?.()
    return getCountries().filter(country => country.cca2 !== exclude)
  })

  // Threshold 0.4 tolerates typos like "Grmany" or "Untd Stats" while still ranking exact matches first
  const fuse = computed(() => new Fuse(availableCountries.value, { keys: ['name'], threshold: 0.4 }))

  const filteredCountries = computed(() => {
    const query = search.value.trim()
    if (!query) return availableCountries.value
    return fuse.value.search(query).map(result => result.item)
  })

  const highlightedIndex = ref(0)

  watch(filteredCountries, () => {
    highlightedIndex.value = 0
  })

  function highlightNext () {
    highlightedIndex.value = Math.min(highlightedIndex.value + 1, filteredCountries.value.length - 1)
  }

  function highlightPrev () {
    highlightedIndex.value = Math.max(highlightedIndex.value - 1, 0)
  }

  function clearSearch () {
    search.value = ''
    searchInputEl.value?.focus()
  }

  function close () {
    search.value = ''
    isOpen.value = false
    highlightedIndex.value = 0
  }

  useClickOutside(rootEl, close)

  return {
    search,
    isOpen,
    rootEl,
    searchInputEl,
    filteredCountries,
    highlightedIndex,
    highlightNext,
    highlightPrev,
    clearSearch,
    close
  }
}
