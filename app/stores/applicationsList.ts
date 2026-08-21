import type { ApplicationStatus, SubmittedApplication, VisaApplication } from '~/types/visa-application'

const STATUSES: ApplicationStatus[] = ['Pending', 'Approved', 'Rejected']

function randomStatus (): ApplicationStatus {
  return STATUSES[Math.floor(Math.random() * STATUSES.length)]!
}

export const useApplicationsListStore = defineStore('applicationsList', () => {
  const applications = ref<SubmittedApplication[]>([])

  function addApplication (application: VisaApplication) {
    applications.value.unshift({
      ...application,
      id: crypto.randomUUID(),
      submittedAt: new Date(),
      status: randomStatus()
    })
  }

  return { applications, addApplication }
}, {
  persist: {
    storage: piniaPluginPersistedstate.sessionStorage(),
    serializer: {
      serialize: state => JSON.stringify(state),
      // Dates come back as strings from JSON, revive them before they hydrate the store.
      deserialize: (raw) => {
        const parsed = JSON.parse(raw) as { applications: SubmittedApplication[] }
        return {
          applications: parsed.applications.map(application => ({
            ...application,
            submittedAt: new Date(application.submittedAt)
          }))
        }
      }
    }
  }
})
