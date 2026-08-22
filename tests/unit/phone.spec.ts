import { describe, expect, it } from 'vitest'
import { detectPhoneCountry, formatPhoneDisplay, resolvePhoneCountry } from '~/utils/phone'
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

describe('detectPhoneCountry', () => {
  const croatia = createCountry({ name: 'Croatia', cca2: 'HR', callingCode: '+385' })
  const spain = createCountry({ name: 'Spain', cca2: 'ES', callingCode: '+34' })
  const countries = [croatia, spain]

  it('returns null when the value does not start with a plus sign', () => {
    expect(detectPhoneCountry('385919802228', countries)).toBeNull()
  })

  it('returns null when no country matches the typed prefix', () => {
    expect(detectPhoneCountry('+999919802228', countries)).toBeNull()
  })

  it('detects the country from a full international number and strips the calling code', () => {
    expect(detectPhoneCountry('+385919802228', countries)).toEqual({ country: croatia, rest: '919802228' })
  })

  it('trims a leading space left after the calling code', () => {
    expect(detectPhoneCountry('+385 919802228', countries)).toEqual({ country: croatia, rest: '919802228' })
  })

  it('matches the longest calling code when one is a prefix of another', () => {
    const shortCode = createCountry({ name: 'ShortCode', cca2: 'SC', callingCode: '+3' })
    const longCode = createCountry({ name: 'Croatia', cca2: 'HR', callingCode: '+385' })
    const result = detectPhoneCountry('+385919802228', [shortCode, longCode])
    expect(result?.country).toEqual(longCode)
  })

  it('returns null while only a partial calling code has been typed', () => {
    expect(detectPhoneCountry('+3', countries)).toBeNull()
  })
})
