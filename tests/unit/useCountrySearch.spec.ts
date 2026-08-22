import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, h } from 'vue'
import type { Country } from '~/types/country'

function createCountry (overrides: Partial<Country> = {}): Country {
  return {
    name: 'Croatia',
    cca2: 'HR',
    capital: 'Zagreb',
    flagUrl: '',
    region: 'Europe',
    population: 1,
    languages: [],
    callingCode: '+385',
    ...overrides
  }
}

const countries: Country[] = [
  createCountry(),
  createCountry({ name: 'Spain', cca2: 'ES', callingCode: '+34' }),
  createCountry({ name: 'Germany', cca2: 'DE', callingCode: '+49' })
]

async function filterFor (query: string): Promise<Country[]> {
  let result: Country[] = []

  const Host = defineComponent({
    setup () {
      const { search, filteredCountries } = useCountrySearch(() => countries)
      search.value = query
      result = filteredCountries.value
      return () => h('div')
    }
  })

  await mountSuspended(Host)
  return result
}

describe('useCountrySearch', () => {
  it('fuzzy matches by name, tolerating typos', async () => {
    const result = await filterFor('Grmany')
    expect(result.map(country => country.cca2)).toContain('DE')
  })

  it('matches a calling code with the leading plus sign', async () => {
    const result = await filterFor('+385')
    expect(result.map(country => country.cca2)).toEqual(['HR'])
  })

  it('matches a calling code without the leading plus sign', async () => {
    const result = await filterFor('385')
    expect(result.map(country => country.cca2)).toEqual(['HR'])
  })

  it('matches a partial calling code', async () => {
    const result = await filterFor('34')
    expect(result.map(country => country.cca2)).toContain('ES')
  })

  it('returns everything when the search is empty', async () => {
    const result = await filterFor('')
    expect(result).toHaveLength(countries.length)
  })

  it('returns nothing for a query that matches neither a name nor a code', async () => {
    const result = await filterFor('zzzzzz')
    expect(result).toHaveLength(0)
  })
})
