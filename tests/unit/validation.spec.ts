import { describe, expect, it } from 'vitest'
import {
  hasErrors,
  isRequired,
  isValidEmail,
  isValidFullName,
  isValidPassportNumber,
  isValidPastDate,
  isValidPhone,
  validatePersonalDetails
} from '~/utils/validation'
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

  it('rejects an implausibly old date, like a typo landing on the year 100', () => {
    expect(isValidPastDate('0100-01-01')).toBe(false)
  })

  it('rejects a date older than 120 years', () => {
    const tooOldYear = new Date().getFullYear() - 121
    expect(isValidPastDate(`${tooOldYear}-01-01`)).toBe(false)
  })
})

describe('isValidFullName', () => {
  it('rejects a name with no letters', () => {
    expect(isValidFullName('12345')).toBe(false)
    expect(isValidFullName('!!!')).toBe(false)
  })

  it('accepts a simple name', () => {
    expect(isValidFullName('John Doe')).toBe(true)
  })

  it('accepts accented and hyphenated names', () => {
    expect(isValidFullName('José García-López')).toBe(true)
  })
})

describe('isValidPhone', () => {
  it('rejects letters', () => {
    expect(isValidPhone('abcdefgh')).toBe(false)
  })

  it('rejects an implausibly short number', () => {
    expect(isValidPhone('12')).toBe(false)
  })

  it('accepts a plausible local number', () => {
    expect(isValidPhone('912345678')).toBe(true)
  })

  it('accepts common separators like spaces and dashes', () => {
    expect(isValidPhone('91 234 5678')).toBe(true)
    expect(isValidPhone('91-234-5678')).toBe(true)
  })
})

describe('isValidPassportNumber', () => {
  it('rejects a value that is too short', () => {
    expect(isValidPassportNumber('AB12')).toBe(false)
  })

  it('rejects symbols', () => {
    expect(isValidPassportNumber('AB-123456')).toBe(false)
  })

  it('accepts a plausible alphanumeric passport number', () => {
    expect(isValidPassportNumber('AB1234567')).toBe(true)
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

  it('flags a full name with no letters as invalid rather than missing', () => {
    const errors = validatePersonalDetails(createApplication({ fullName: '12345' }))
    expect(errors.fullName).toBe('Enter a valid full name')
  })

  it('flags a phone number containing letters as invalid rather than missing', () => {
    const errors = validatePersonalDetails(createApplication({ phone: 'abcdefgh' }))
    expect(errors.phone).toBe('Enter a valid phone number')
  })

  it('flags a too-short passport number as invalid rather than missing', () => {
    const errors = validatePersonalDetails(createApplication({ passportNumber: 'AB12' }))
    expect(errors.passportNumber).toBe('Enter a valid passport number')
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
