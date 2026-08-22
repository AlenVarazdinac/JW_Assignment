import type { Country } from '~/types/country'

export function resolvePhoneCountry (phoneCountry: Country | null, citizenship: Country | null): Country | null {
  return phoneCountry ?? citizenship
}

export function formatPhoneDisplay (phone: string, phoneCountry: Country | null, citizenship: Country | null): string {
  const callingCode = resolvePhoneCountry(phoneCountry, citizenship)?.callingCode
  return callingCode ? `${callingCode} ${phone}` : phone
}

export interface PhoneCountryDetection {
  country: Country
  rest: string
}

export function detectPhoneCountry (value: string, countries: Country[]): PhoneCountryDetection | null {
  if (!value.startsWith('+')) return null

  const match = countries
    .filter(country => country.callingCode && value.startsWith(country.callingCode))
    .sort((a, b) => b.callingCode.length - a.callingCode.length)[0]

  if (!match) return null

  return { country: match, rest: value.slice(match.callingCode.length).trimStart() }
}
