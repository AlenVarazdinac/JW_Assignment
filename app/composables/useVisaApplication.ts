import type { VisaApplication } from '~/types/visa-application'
import { validateCountrySelection, validatePersonalDetails, hasErrors } from '~/utils/validation'

// Module-scope singleton.. every component calling useVisaApplication() shares this same state.
const application = reactive<VisaApplication>({
  citizenship: null,
  destination: null,
  fullName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  passportNumber: ''
})

const currentStep = ref(1)

const errors = reactive<Record<string, string>>({
  citizenship: '',
  destination: '',
  fullName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  passportNumber: ''
})

function validateStep (step: number): boolean {
  if (step === 1) {
    const stepErrors = validateCountrySelection(application)
    Object.assign(errors, stepErrors)
    return !hasErrors(stepErrors)
  }

  if (step === 2) {
    const stepErrors = validatePersonalDetails(application)
    Object.assign(errors, stepErrors)
    return !hasErrors(stepErrors)
  }

  return true
}

function goToStep (step: number) {
  currentStep.value = step
}

function nextStep () {
  if (!validateStep(currentStep.value)) return
  currentStep.value += 1
}

function prevStep () {
  currentStep.value -= 1
}

function reset () {
  application.citizenship = null
  application.destination = null
  application.fullName = ''
  application.email = ''
  application.phone = ''
  application.dateOfBirth = ''
  application.passportNumber = ''
  currentStep.value = 1

  for (const key of Object.keys(errors)) errors[key] = ''
}

export function useVisaApplication () {
  return { application, currentStep, errors, goToStep, nextStep, prevStep, reset }
}
