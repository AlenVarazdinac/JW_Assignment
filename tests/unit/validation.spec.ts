import { describe, expect, it } from 'vitest'
import { hasErrors, isRequired, isValidEmail, isValidPastDate, validatePersonalDetails } from '~/utils/validation'
import type { VisaApplication } from '~/types/visa-application'

function createApplication (overrides: Partial<VisaApplication> = {}): VisaApplication {
  return {
    citizenship: null,
    destination: null,
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '912345678',
    phoneCountry: null,
    dateOfBirth: '1990-03-15',
    passportNumber: 'AB1234567',
    ...overrides
  }
}

describe('isRequired', () => {
  it('rejects empty and whitespace-only strings', () => {
    expect(isRequired('')).toBe(false)
    expect(isRequired('   ')).toBe(false)
  })

  it('accepts non-empty strings', () => {
    expect(isRequired('John')).toBe(true)
  })
})

describe('isValidEmail', () => {
  it('rejects strings without an @ or a domain', () => {
    expect(isValidEmail('not-an-email')).toBe(false)
    expect(isValidEmail('missing@domain')).toBe(false)
  })

  it('accepts a well-formed email', () => {
    expect(isValidEmail('john.doe@example.com')).toBe(true)
  })
})

describe('isValidPastDate', () => {
  it('rejects an empty value', () => {
    expect(isValidPastDate('')).toBe(false)
  })

  it('rejects an unparseable date', () => {
    expect(isValidPastDate('not-a-date')).toBe(false)
  })

  it('rejects a date in the future', () => {
    const futureYear = new Date().getFullYear() + 5
    expect(isValidPastDate(`${futureYear}-01-01`)).toBe(false)
  })

  it('accepts a valid date in the past', () => {
    expect(isValidPastDate('1990-03-15')).toBe(true)
  })
})

describe('validatePersonalDetails', () => {
  it('returns no errors for a fully valid application', () => {
    const errors = validatePersonalDetails(createApplication())
    expect(hasErrors(errors)).toBe(false)
  })

  it('flags every required field when they are all empty', () => {
    const errors = validatePersonalDetails(createApplication({
      fullName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      passportNumber: ''
    }))

    expect(errors.fullName).toBe('Full name is required')
    expect(errors.email).toBe('Email is required')
    expect(errors.phone).toBe('Phone number is required')
    expect(errors.dateOfBirth).toBe('Date of birth is required')
    expect(errors.passportNumber).toBe('Passport number is required')
  })

  it('flags an invalid email format separately from a missing one', () => {
    const errors = validatePersonalDetails(createApplication({ email: 'not-an-email' }))
    expect(errors.email).toBe('Enter a valid email address')
  })

  it('flags a future date of birth as invalid rather than missing', () => {
    const futureYear = new Date().getFullYear() + 5
    const errors = validatePersonalDetails(createApplication({ dateOfBirth: `${futureYear}-01-01` }))
    expect(errors.dateOfBirth).toBe('Enter a valid date of birth')
  })
})

describe('hasErrors', () => {
  it('returns false when every value is empty', () => {
    expect(hasErrors({ a: '', b: '' })).toBe(false)
  })

  it('returns true when at least one value is truthy', () => {
    expect(hasErrors({ a: '', b: 'Required' })).toBe(true)
  })
})
