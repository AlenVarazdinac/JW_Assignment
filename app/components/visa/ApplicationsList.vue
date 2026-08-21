<script setup lang="ts">
const { applications } = storeToRefs(useApplicationsListStore())
</script>

<template>
  <div>
    <div class="mb-3 flex items-center justify-between">
      <h3 class="text-input-label text-black">
        Recent Submissions
      </h3>
      <span class="text-body-xs text-gray-400">
        {{ applications.length }} Record{{ applications.length === 1 ? '' : 's' }}
      </span>
    </div>

    <div
      v-if="applications.length === 0"
      class="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-200 bg-white py-10"
    >
      <Icon
        name="custom:danger-circle"
        class="size-6 text-gray-400"
      />
      <p class="text-input-label text-black">
        No applications submitted yet.
      </p>
    </div>
  </div>
</template>
