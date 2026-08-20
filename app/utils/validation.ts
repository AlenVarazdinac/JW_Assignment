import type { VisaApplication } from '~/types/visa-application'

export function isRequired (value: string): boolean {
  return value.trim().length > 0
}

export function isValidEmail (value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function isValidPastDate (value: string): boolean {
  if (!value) return false

  const date = new Date(value)

  return !Number.isNaN(date.getTime()) && date < new Date()
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

  if (!isRequired(application.fullName)) errors.fullName = 'Full name is required'

  if (!isRequired(application.email)) {
    errors.email = 'Email is required'
  }
  else if (!isValidEmail(application.email)) {
    errors.email = 'Enter a valid email address'
  }

  if (!isRequired(application.phone)) errors.phone = 'Phone number is required'

  if (!isRequired(application.dateOfBirth)) {
    errors.dateOfBirth = 'Date of birth is required'
  }
  else if (!isValidPastDate(application.dateOfBirth)) {
    errors.dateOfBirth = 'Enter a valid date of birth'
  }

  if (!isRequired(application.passportNumber)) errors.passportNumber = 'Passport number is required'

  return errors
}

export function hasErrors (errors: object): boolean {
  return Object.values(errors).some(Boolean)
}
