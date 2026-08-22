import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useApplicationsListStore } from '~/stores/applicationsList'
import type { Country } from '~/types/country'
import type { VisaApplication } from '~/types/visa-application'

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

function createApplication (overrides: Partial<VisaApplication> = {}): VisaApplication {
  return {
    citizenship: createCountry(),
    destination: createCountry({ cca2: 'ES', name: 'Spain' }),
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '912345678',
    phoneCountry: null,
    dateOfBirth: '1990-01-01',
    passportNumber: 'AB1234567',
    ...overrides
  }
}

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('useApplicationsListStore', () => {
  it('adds new submissions to the front of the list', () => {
    const store = useApplicationsListStore()

    store.addApplication(createApplication({ fullName: 'First' }))
    store.addApplication(createApplication({ fullName: 'Second' }))

    expect(store.applications.map(application => application.fullName)).toEqual(['Second', 'First'])
  })

  it('assigns an id, a submission date, and a status to each submission', () => {
    const store = useApplicationsListStore()

    store.addApplication(createApplication())

    const [submitted] = store.applications
    expect(submitted!.id).toBeTruthy()
    expect(submitted!.submittedAt).toBeInstanceOf(Date)
    expect(['Pending', 'Approved', 'Rejected']).toContain(submitted!.status)
  })

  it('gives each submission a different id', () => {
    const store = useApplicationsListStore()

    store.addApplication(createApplication())
    store.addApplication(createApplication())

    const [first, second] = store.applications
    expect(first!.id).not.toBe(second!.id)
  })
})
