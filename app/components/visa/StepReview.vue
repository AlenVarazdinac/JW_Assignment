<script setup lang="ts">
const visaApplicationStore = useVisaApplicationStore()
const { application } = storeToRefs(visaApplicationStore)
const { prevStep, reset } = visaApplicationStore
const { addApplication } = useApplicationsListStore()

const route = computed(() => {
  if (!application.value.citizenship || !application.value.destination) return null
  return { citizenship: application.value.citizenship, destination: application.value.destination }
})

const phoneDisplay = computed(() =>
  formatPhoneDisplay(application.value.phone, application.value.phoneCountry, application.value.citizenship)
)

const dobDisplay = computed(() => {
  if (!application.value.dateOfBirth) return '-'
  return new Date(application.value.dateOfBirth).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
})

function submit () {
  addApplication(application.value)
  reset()
}
</script>

<template>
  <form
    class="rounded-b-xl bg-white pt-11 pb-4"
    @submit.prevent="submit"
  >
    <div class="px-4 sm:px-7">
      <h2 class="mb-1.5 text-heading-m-bold text-black">
        Review & Confirm
      </h2>
      <p class="mb-10 text-body-s text-black">
        Final check of your application data before submission.
      </p>

      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div class="flex flex-col gap-2 rounded-xl border border-gray-200 bg-gray-50 px-6 py-5">
          <div class="flex items-center justify-between">
            <span class="text-body-s text-gray-700">Name</span>
            <span class="text-button-s text-black">{{ application.fullName }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-body-s text-gray-700">Email</span>
            <span class="text-button-s text-black">{{ application.email }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-body-s text-gray-700">Phone</span>
            <span class="text-button-s text-black">{{ phoneDisplay }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-body-s text-gray-700">DOB</span>
            <span class="text-button-s text-black">{{ dobDisplay }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-body-s text-gray-700">Passport</span>
            <span class="text-button-s text-black">{{ application.passportNumber }}</span>
          </div>
        </div>

        <div
          v-if="route"
          class="flex flex-col gap-3"
        >
          <UiCountryInfoCard
            label="Citizenship"
            :country="route.citizenship"
          />
          <UiCountryInfoCard
            label="Destination"
            :country="route.destination"
          />
        </div>
      </div>

      <div class="mt-5 flex items-start gap-3 rounded-lg border border-info-200 bg-info-25 p-3">
        <Icon
          name="custom:info-circle-bold"
          class="size-6 shrink-0 text-info-600"
        />
        <p class="text-body-s text-black">
          By clicking "Submit Application", you confirm that all provided information is true and accurate. False
          information may result in immediate rejection.
        </p>
      </div>
    </div>

    <hr class="mt-11 mb-4 border-t border-gray-100" />

    <div class="flex justify-between px-4 sm:px-7">
      <UiIconButton
        variant="gray-outline"
        size="sm"
        label="Back"
        @click="prevStep"
      >
        <Icon
          name="custom:alt-arrow-left"
          class="size-5"
        />
      </UiIconButton>

      <UiButton type="submit">
        Submit Application
        <template #icon-right>
          <Icon
            name="custom:alt-arrow-right"
            class="size-5"
          />
        </template>
      </UiButton>
    </div>
  </form>
</template>
