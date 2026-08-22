import type { Country } from '~/types/country'

export function resolvePhoneCountry (phoneCountry: Country | null, citizenship: Country | null): Country | null {
  return phoneCountry ?? citizenship
}

export function formatPhoneDisplay (phone: string, phoneCountry: Country | null, citizenship: Country | null): string {
  const callingCode = resolvePhoneCountry(phoneCountry, citizenship)?.callingCode
  return callingCode ? `${callingCode} ${phone}` : phone
}
