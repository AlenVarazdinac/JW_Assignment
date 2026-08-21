import type { Country } from './country'

export type ApplicationStatus = 'Pending' | 'Approved' | 'Rejected'

export interface VisaApplication {
  citizenship: Country | null
  destination: Country | null
  fullName: string
  email: string
  phone: string
  phoneCountry: Country | null
  dateOfBirth: string
  passportNumber: string
}

export interface SubmittedApplication extends VisaApplication {
  id: string
  submittedAt: Date
  status: ApplicationStatus
}
