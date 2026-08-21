<template>
  <div class="flex flex-col gap-16">
    <VisaWizard />
    <ClientOnly>
      <VisaApplicationsList />
    </ClientOnly>
  </div>
</template>
