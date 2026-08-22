import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useVisaApplicationStore } from '~/stores/visaApplication'
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

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('useVisaApplicationStore', () => {
  it('blocks advancing past step 1 when citizenship/destination are missing', () => {
    const store = useVisaApplicationStore()

    store.nextStep()

    expect(store.currentStep).toBe(1)
    expect(store.errors.citizenship).toBeTruthy()
    expect(store.errors.destination).toBeTruthy()
  })

  it('advances to step 2 once citizenship and destination are set', () => {
    const store = useVisaApplicationStore()
    store.application.citizenship = createCountry()
    store.application.destination = createCountry({ cca2: 'ES', name: 'Spain' })

    store.nextStep()

    expect(store.currentStep).toBe(2)
  })

  it('clears a field error as soon as it is edited', async () => {
    const store = useVisaApplicationStore()
    store.nextStep()
    expect(store.errors.citizenship).toBeTruthy()

    store.application.citizenship = createCountry()
    await nextTick()

    expect(store.errors.citizenship).toBe('')
  })

  it('does not advance past the last step', () => {
    const store = useVisaApplicationStore()
    store.application.citizenship = createCountry()
    store.application.destination = createCountry({ cca2: 'ES', name: 'Spain' })
    store.nextStep()

    store.application.fullName = 'John Doe'
    store.application.email = 'john.doe@example.com'
    store.application.phone = '912345678'
    store.application.dateOfBirth = '1990-01-01'
    store.application.passportNumber = 'AB1234567'
    store.nextStep()

    store.nextStep()

    expect(store.currentStep).toBe(3)
  })

  it('does not go below step 1', () => {
    const store = useVisaApplicationStore()

    store.prevStep()

    expect(store.currentStep).toBe(1)
  })

  it('reset clears application data, the step, and errors', () => {
    const store = useVisaApplicationStore()
    store.application.fullName = 'John Doe'
    store.nextStep()

    store.reset()

    expect(store.currentStep).toBe(1)
    expect(store.application.fullName).toBe('')
    expect(store.errors.citizenship).toBe('')
  })
})
