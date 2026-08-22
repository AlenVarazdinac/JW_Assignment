import { describe, expect, it } from 'vitest'
import { formatPhoneDisplay, resolvePhoneCountry } from '~/utils/phone'
import type { Country } from '~/types/country'

function createCountry (overrides: Partial<Country> = {}): Country {
  return {
    name: 'Croatia',
    cca2: 'HR',
    capital: 'Zagreb',
    flagUrl: 'https://example.com/hr.svg',
    region: 'Europe',
    population: 3871833,
    languages: ['Croatian'],
    callingCode: '+385',
    ...overrides
  }
}

describe('resolvePhoneCountry', () => {
  it('falls back to citizenship when no phone country override is set', () => {
    const citizenship = createCountry()
    expect(resolvePhoneCountry(null, citizenship)).toEqual(citizenship)
  })

  it('prefers the explicit phone country override over citizenship', () => {
    const citizenship = createCountry({ name: 'Croatia', callingCode: '+385' })
    const phoneCountry = createCountry({ name: 'Spain', cca2: 'ES', callingCode: '+34' })
    expect(resolvePhoneCountry(phoneCountry, citizenship)).toEqual(phoneCountry)
  })

  it('returns null when neither is set', () => {
    expect(resolvePhoneCountry(null, null)).toBeNull()
  })
})

describe('formatPhoneDisplay', () => {
  it('prefixes the phone number with the citizenship calling code by default', () => {
    const citizenship = createCountry({ callingCode: '+385' })
    expect(formatPhoneDisplay('912345678', null, citizenship)).toBe('+385 912345678')
  })

  it('prefixes with the overridden phone country calling code instead of citizenship', () => {
    const citizenship = createCountry({ name: 'Croatia', callingCode: '+385' })
    const phoneCountry = createCountry({ name: 'Spain', cca2: 'ES', callingCode: '+34' })
    expect(formatPhoneDisplay('912345678', phoneCountry, citizenship)).toBe('+34 912345678')
  })

  it('returns the raw phone number when no calling code is available', () => {
    expect(formatPhoneDisplay('912345678', null, null)).toBe('912345678')
  })
})
