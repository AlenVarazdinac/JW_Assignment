<template>
  <div class="flex flex-col gap-8 sm:gap-16">
    <VisaWizard />
    <ClientOnly>
      <VisaApplicationsList />
    </ClientOnly>
  </div>
</template>
