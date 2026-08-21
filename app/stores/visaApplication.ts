import type { VisaApplication } from '~/types/visa-application'
import { validateCountrySelection, validatePersonalDetails, hasErrors } from '~/utils/validation'

function createApplication (): VisaApplication {
  return {
    citizenship: null,
    destination: null,
    fullName: '',
    email: '',
    phone: '',
    phoneCountry: null,
    dateOfBirth: '',
    passportNumber: ''
  }
}

function createErrors (): Record<string, string> {
  return {
    citizenship: '',
    destination: '',
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    passportNumber: ''
  }
}

export const useVisaApplicationStore = defineStore('visaApplication', () => {
  const application = reactive<VisaApplication>(createApplication())
  const currentStep = ref(1)
  const errors = reactive<Record<string, string>>(createErrors())

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
    Object.assign(application, createApplication())
    currentStep.value = 1
    Object.assign(errors, createErrors())
  }

  return { application, currentStep, errors, goToStep, nextStep, prevStep, reset }
})
