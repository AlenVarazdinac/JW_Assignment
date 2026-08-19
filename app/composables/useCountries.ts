import type { Country } from '~/types/country'

export function useCountries() {
  const { data: countries, pending, error } = useFetch<Country[]>('/api/countries', {
    key: 'countries',
    default: () => [] as Country[]
  })

  return { countries, pending, error }
}
