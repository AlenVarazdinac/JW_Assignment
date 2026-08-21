<script setup lang="ts">
const { currentStep } = storeToRefs(useVisaApplicationStore())
</script>

<template>
  <div class="shadow-elevation-3">
    <VisaWizardStepper :current-step="currentStep" />
    <Transition
      mode="out-in"
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-x-2"
      enter-to-class="opacity-100 translate-x-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-x-0"
      leave-to-class="opacity-0 -translate-x-2"
    >
      <VisaStepCountrySelection v-if="currentStep === 1" />
      <VisaStepPersonalDetails v-else-if="currentStep === 2" />
      <VisaStepReview v-else-if="currentStep === 3" />
    </Transition>
  </div>
</template>
