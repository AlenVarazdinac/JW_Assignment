<script setup lang="ts">
const { currentStep } = storeToRefs(useVisaApplicationStore())
</script>

<template>
  <div class="shadow-elevation-3">
    <VisaWizardStepper :current-step="currentStep" />
    <VisaStepCountrySelection v-if="currentStep === 1" />
    <VisaStepPersonalDetails v-else-if="currentStep === 2" />
  </div>
</template>
