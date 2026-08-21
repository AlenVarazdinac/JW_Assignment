<script setup lang="ts">
const visaApplicationStore = useVisaApplicationStore()
const { application, errors } = storeToRefs(visaApplicationStore)
const { nextStep, prevStep } = visaApplicationStore
const { countries } = useCountries()

const phoneCountry = computed({
  get: () => application.value.phoneCountry ?? application.value.citizenship,
  set: value => (application.value.phoneCountry = value)
})
</script>

<template>
  <form
    class="rounded-b-xl bg-white pt-11 pb-4"
    @submit.prevent="nextStep"
  >
    <div class="px-7">
      <h2 class="mb-1.5 text-heading-m-bold text-black">
        Personal Details
      </h2>
      <p class="mb-10 text-body-s text-black">
        Please provide accurate information as it appears on your official documents.
      </p>

      <div class="grid grid-cols-2 gap-4">
        <UiTextInput
          v-model="application.fullName"
          label="Full Name"
          placeholder="John Doe"
          :support-text="errors.fullName"
          :error="!!errors.fullName"
        />
        <UiTextInput
          v-model="application.email"
          type="email"
          label="Email Address"
          placeholder="john.doe@example.com"
          :support-text="errors.email"
          :error="!!errors.email"
        />
        <UiTextInput
          v-model="application.phone"
          type="tel"
          label="Phone Number"
          :support-text="errors.phone"
          :error="!!errors.phone"
        >
          <template #leading>
            <UiPhoneCountryCodeSelect
              v-model="phoneCountry"
              :countries="countries"
            />
          </template>
        </UiTextInput>
        <UiDateInput
          v-model="application.dateOfBirth"
          label="Date of Birth"
          :support-text="errors.dateOfBirth"
          :error="!!errors.dateOfBirth"
        />
        <UiTextInput
          v-model="application.passportNumber"
          label="Passport Number"
          placeholder="AB1234567"
          :support-text="errors.passportNumber"
          :error="!!errors.passportNumber"
        />
      </div>
    </div>

    <hr class="mt-11 mb-4 border-t border-gray-100" />

    <div class="flex justify-between px-7">
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
        Continue
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
