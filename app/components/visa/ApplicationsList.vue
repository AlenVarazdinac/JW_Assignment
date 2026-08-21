<script setup lang="ts">
const { applications } = storeToRefs(useApplicationsListStore())
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
  </div>
</template>
