<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'button' | 'submit'
    disabled?: boolean
  }>(),
  {
    type: 'button',
    disabled: false
  }
)
</script>

<template>
  <button
    :type="type"
    :disabled
    class="inline-flex items-center justify-center gap-1.5 rounded-full bg-primary-600 px-4 py-3 text-button-l text-white transition-colors hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:pointer-events-none disabled:bg-primary-25 disabled:text-primary-300"
  >
    <slot name="icon-left" />
    <slot />
    <slot name="icon-right" />
  </button>
</template>
