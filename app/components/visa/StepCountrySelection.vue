<script setup lang="ts">
const visaApplicationStore = useVisaApplicationStore()
const { application, errors } = storeToRefs(visaApplicationStore)
const { nextStep } = visaApplicationStore
const { countries, pending, error } = useCountries()

const validatedRoute = computed(() => {
  if (!application.value.citizenship || !application.value.destination || errors.value.destination) return null
  return { citizenship: application.value.citizenship, destination: application.value.destination }
})
</script>

<template>
  <form
    class="rounded-b-xl bg-white pt-11 pb-4"
    @submit.prevent="nextStep"
  >
    <div class="px-7">
      <h2 class="mb-1.5 text-heading-m-bold text-black">
        Select your journey
      </h2>
      <p class="mb-10 text-body-s text-black">
        Define your origin and destination to begin the application process.
      </p>

      <p
        v-if="pending"
        class="mb-4 text-body-s text-gray-500"
      >
        Loading countries…
      </p>
      <p
        v-else-if="error"
        class="mb-4 text-body-s text-error-600"
      >
        Failed to load countries. Please refresh the page.
      </p>

      <div
        class="grid grid-cols-2 gap-6"
        :class="!validatedRoute ? 'mb-30.5' : ''"
      >
        <UiCountrySelect
          v-model="application.citizenship"
          label="Citizenship"
          :countries="countries"
          :exclude-cca2="application.destination?.cca2"
          :support-text="errors.citizenship"
          :error="!!errors.citizenship"
        />
        <UiCountrySelect
          v-model="application.destination"
          label="Destination"
          :countries="countries"
          :exclude-cca2="application.citizenship?.cca2"
          :support-text="errors.destination"
          :error="!!errors.destination"
        />
      </div>

      <div
        v-if="validatedRoute"
        class="mt-4 mb-11 flex items-center rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
      >
        <UiCountryRoutePreview
          class="flex-1"
          :citizenship="validatedRoute.citizenship"
          :destination="validatedRoute.destination"
          label="Route Validated"
          test-id="route-summary"
        />
        <Icon
          name="custom:check-circle-bold"
          class="ml-4 size-6 shrink-0 text-success-500"
        />
      </div>
    </div>

    <hr class="mb-4 border-t border-gray-100" />

    <div class="flex justify-end px-7">
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
