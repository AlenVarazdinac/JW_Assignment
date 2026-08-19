<script setup lang="ts">
import type { Country } from '~/types/country'

const { countries } = useCountries()

const citizenship = ref<Country | null>(null)
const destination = ref<Country | null>(null)

// TODO: Remove
watchEffect(() => {
  console.log('[countries]', countries.value)
})
</script>

<template>
  <div class="page">
    <h1>Country Selection</h1>

    <div class="page__fields">
      <UiCountrySelect
        v-model="citizenship"
        label="Citizenship"
        :countries="countries"
        :exclude-cca2="destination?.cca2"
      />
      <UiCountrySelect
        v-model="destination"
        label="Destination"
        :countries="countries"
        :exclude-cca2="citizenship?.cca2"
      />
    </div>
  </div>
</template>

<style scoped>
.page {
  padding: 2rem;
}

.page__fields {
  display: flex;
  gap: 1.5rem;
}
</style>
