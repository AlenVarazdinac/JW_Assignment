<script setup lang="ts">
const props = defineProps<{
  currentStep: number
}>()

const stepDefinitions = [
  { step: 1, label: 'Geography', icon: 'custom:global-bold' },
  { step: 2, label: 'Identity', icon: 'custom:clipboard-check-bold' },
  { step: 3, label: 'Verification', icon: 'custom:check-circle-bold' }
]

const steps = computed(() =>
  stepDefinitions.map(item => ({
    ...item,
    isActive: item.step <= props.currentStep,
    isConnectorActive: item.step - 1 <= props.currentStep
  }))
)
</script>

<template>
  <div class="flex items-center rounded-t-xl bg-primary-25 px-4 py-4 sm:px-7 sm:py-5">
    <template
      v-for="(item, index) in steps"
      :key="item.step"
    >
      <div
        v-if="index > 0"
        class="mx-1.5 h-px flex-1 border-t border-dashed sm:mx-3"
        :class="item.isConnectorActive ? 'border-primary-600' : 'border-primary-200'"
      />

      <div class="flex items-center gap-2">
        <span
          class="flex size-7 shrink-0 items-center justify-center rounded-full"
          :class="item.isActive ? 'bg-primary-700' : 'bg-primary-100'"
        >
          <Icon
            :name="item.icon"
            class="size-5"
            :class="item.isActive ? 'text-white' : 'text-gray-25'"
          />
        </span>
        <span
          class="hidden text-input-label sm:inline"
          :class="item.isActive ? 'text-primary-700' : 'text-primary-200'"
        >
          {{ item.label }}
        </span>
      </div>
    </template>
  </div>
</template>
