<script setup lang="ts">
type Variant = 'primary' | 'primary-outline' | 'white' | 'gray-outline'
type Size = 'md' | 'sm'

withDefaults(
  defineProps<{
    label: string
    variant?: Variant
    size?: Size
    disabled?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'md',
    disabled: false
  }
)

const variantClasses: Record<Variant, string> = {
  'primary':
    'bg-primary-700 text-white hover:bg-primary-800 disabled:bg-primary-25 disabled:text-primary-300',
  'primary-outline':
    'border border-primary-50 text-primary-700 hover:border-primary-800 hover:text-primary-800 disabled:border-primary-50 disabled:text-primary-200',
  'white':
    'bg-white text-gray-900 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.08)] hover:bg-gray-100 hover:shadow-none disabled:bg-gray-100 disabled:text-gray-300 disabled:shadow-none',
  'gray-outline':
    'border border-gray-100 text-gray-900 hover:border-gray-200 disabled:border-gray-100 disabled:text-gray-300'
}

const sizeClasses: Record<Size, string> = {
  md: 'size-13 p-4',
  sm: 'size-11.5 p-3.25'
}
</script>

<template>
  <button
    type="button"
    :aria-label="label"
    :disabled
    class="inline-flex cursor-pointer items-center justify-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:pointer-events-none disabled:cursor-not-allowed"
    :class="[variantClasses[variant], sizeClasses[size]]"
  >
    <slot />
  </button>
</template>
