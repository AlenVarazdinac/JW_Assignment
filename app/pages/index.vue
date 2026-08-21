<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="mx-auto w-220 shadow-elevation-3">
      <VisaWizardStepper :current-step="1" />
      <VisaStepCountrySelection />
    </div>

    <div class="mx-auto mt-6 w-220">
      <VisaApplicationsList />
    </div>
  </div>
</template>
