<script setup lang="ts">
const { applications } = storeToRefs(useApplicationsListStore())

function formatSubmittedAt (date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
}
</script>

<template>
  <div>
    <div class="mb-5 flex items-center justify-between">
      <h3 class="text-heading-s text-black">
        Recent Submissions
      </h3>
      <span class="text-body-l text-black">
        {{ applications.length }} Record{{ applications.length === 1 ? '' : 's' }}
      </span>
    </div>

    <div
      v-if="applications.length === 0"
      class="flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-11"
    >
      <Icon
        name="custom:danger-circle"
        class="size-8 text-black"
      />
      <p class="text-heading-s text-center text-black">
        No applications submitted yet.
      </p>
    </div>

    <div
      v-else
      class="flex flex-col gap-1.5"
    >
      <div
        v-for="submitted in applications"
        :key="submitted.id"
        class="flex w-full flex-col gap-4 rounded-xl border border-gray-100 bg-white px-5 py-5 shadow-elevation-1 sm:flex-row sm:items-center sm:justify-between sm:gap-0"
      >
        <UiCountryRoutePreview
          :citizenship="submitted.citizenship!"
          :destination="submitted.destination!"
          :label="submitted.fullName"
        />

        <div class="flex items-center gap-5">
          <div class="text-right">
            <p class="text-body-xs text-gray-800">
              Submitted
            </p>
            <p class="text-button-s text-black">
              {{ formatSubmittedAt(submitted.submittedAt) }}
            </p>
          </div>
          <UiStatusBadge :status="submitted.status" />
        </div>
      </div>
    </div>
  </div>
</template>
