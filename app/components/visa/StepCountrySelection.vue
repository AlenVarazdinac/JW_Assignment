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
        <div class="mr-4 flex -space-x-2">
          <img
            :src="validatedRoute.citizenship.flagUrl"
            :alt="`${validatedRoute.citizenship.name} flag`"
            class="size-7 shrink-0 rounded-full object-cover ring-2 ring-white"
          />
          <img
            :src="validatedRoute.destination.flagUrl"
            :alt="`${validatedRoute.destination.name} flag`"
            class="size-7 shrink-0 rounded-full object-cover ring-2 ring-white"
          />
        </div>
        <div class="flex-1">
          <p class="text-body-xs text-gray-800">
            Route Validated
          </p>
          <p
            class="flex items-center text-button-s text-black"
            data-testid="route-summary"
          >
            {{ validatedRoute.citizenship.name }}
            <Icon
              name="custom:arrow-right"
              class="mx-1.5 size-4.5 shrink-0"
            />
            {{ validatedRoute.destination.name }}
          </p>
        </div>
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
