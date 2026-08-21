<template>
  <div>
    <VisaWizard class="mx-auto mb-16 w-220" />

    <div class="mx-auto mt-6 w-220">
      <ClientOnly>
        <VisaApplicationsList />
      </ClientOnly>
    </div>
  </div>
</template>
