import type { VisaApplication } from '~/types/visa-application'

export function isRequired (value: string): boolean {
  return value.trim().length > 0
}

export function isValidEmail (value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

// Requires at least one letter (rejects "12345" or "!!!"), but keeps `\p{L}` (Unicode letters)
export function isValidFullName (value: string): boolean {
  return /^[\p{L}][\p{L}\s'-]*$/u.test(value.trim())
}

// National number length varies a lot by country (ITU E.164 allows up to 15 digits total,
// so ~14 for the national part once the calling code is stripped off) - this just rejects
// obvious garbage like letters or a single digit, not a per-country format.
export function isValidPhone (value: string): boolean {
  const digitsOnly = value.replace(/[\s()-]/g, '')
  return /^\d{4,14}$/.test(digitsOnly)
}

// Passport formats differ by country too, so this only checks for a plausible
// alphanumeric length rather than a specific pattern.
export function isValidPassportNumber (value: string): boolean {
  return /^[A-Za-z0-9]{5,15}$/.test(value.trim())
}

const MAX_AGE_YEARS = 120

export function isValidPastDate (value: string): boolean {
  if (!value) return false

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return false

  const now = new Date()
  const earliestPlausible = new Date(now.getFullYear() - MAX_AGE_YEARS, now.getMonth(), now.getDate())

  return date < now && date > earliestPlausible
}

export interface CountrySelectionErrors {
  citizenship: string
  destination: string
}

export function validateCountrySelection (application: VisaApplication): CountrySelectionErrors {
  const errors: CountrySelectionErrors = { citizenship: '', destination: '' }

  if (!application.citizenship) errors.citizenship = 'Citizenship is required'
  if (!application.destination) errors.destination = 'Destination is required'

  if (
    application.citizenship
    && application.destination
    && application.citizenship.cca2 === application.destination.cca2
  ) {
    errors.destination = 'Destination must be different from citizenship'
  }

  return errors
}

export interface PersonalDetailsErrors {
  fullName: string
  email: string
  phone: string
  dateOfBirth: string
  passportNumber: string
}

export function validatePersonalDetails (application: VisaApplication): PersonalDetailsErrors {
  const errors: PersonalDetailsErrors = {
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    passportNumber: ''
  }

  if (!isRequired(application.fullName)) {
    errors.fullName = 'Full name is required'
  }
  else if (!isValidFullName(application.fullName)) {
    errors.fullName = 'Enter a valid full name'
  }

  if (!isRequired(application.email)) {
    errors.email = 'Email is required'
  }
  else if (!isValidEmail(application.email)) {
    errors.email = 'Enter a valid email address'
  }

  if (!isRequired(application.phone)) {
    errors.phone = 'Phone number is required'
  }
  else if (!isValidPhone(application.phone)) {
    errors.phone = 'Enter a valid phone number'
  }

  if (!isRequired(application.dateOfBirth)) {
    errors.dateOfBirth = 'Date of birth is required'
  }
  else if (!isValidPastDate(application.dateOfBirth)) {
    errors.dateOfBirth = 'Enter a valid date of birth'
  }

  if (!isRequired(application.passportNumber)) {
    errors.passportNumber = 'Passport number is required'
  }
  else if (!isValidPassportNumber(application.passportNumber)) {
    errors.passportNumber = 'Enter a valid passport number'
  }

  return errors
}

export function hasErrors (errors: object): boolean {
  return Object.values(errors).some(Boolean)
}
