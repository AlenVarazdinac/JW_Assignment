<template>
  <div class="min-h-screen bg-gray-50">
    <header class="flex items-center gap-1 border-b border-gray-200 bg-white px-7 py-6">
      <Icon
        name="custom:logo"
        class="size-6 text-primary-700"
      />
      <span class="font-plus-jakarta text-[14px] leading-5.75 font-bold text-primary-800">Visa Wizard</span>
    </header>

    <main class="mx-auto max-w-360 px-70 py-11">
      <slot />
    </main>
  </div>
</template>
