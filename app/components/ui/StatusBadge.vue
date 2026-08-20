<script setup lang="ts">
import type { ApplicationStatus } from '~/types/visa-application'

defineProps<{
  status: ApplicationStatus
}>()

const config: Record<ApplicationStatus, { icon: string, classes: string }> = {
  Rejected: { icon: 'custom:close-circle', classes: 'bg-error-100 text-error-600' },
  Approved: { icon: 'custom:check-circle', classes: 'bg-success-100 text-success-700' },
  Pending: { icon: 'custom:history', classes: 'bg-warning-100 text-warning-500' }
}
</script>

<template>
  <span
    class="inline-flex h-7.5 items-center gap-1 rounded-full pt-1 pr-2 pb-1.5 pl-1.5 text-chip"
    :class="config[status].classes"
  >
    <Icon
      :name="config[status].icon"
      class="size-5"
    />
    {{ status }}
  </span>
</template>
