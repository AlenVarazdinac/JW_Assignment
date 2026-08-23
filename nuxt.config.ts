import { createResolver } from 'nuxt/kit'
import tailwindcss from '@tailwindcss/vite'

const { resolve } = createResolver(import.meta.url)

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/fonts', '@nuxt/icon', '@nuxt/eslint', '@pinia/nuxt', 'pinia-plugin-persistedstate/nuxt'],
  devtools: { enabled: true },
  app: {
    head: {
      viewport: 'width=device-width, initial-scale=1'
    }
  },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    restCountriesApiKey: ''
  },
  compatibilityDate: '2025-07-15',
  vite: {
    plugins: [tailwindcss()]
  },
  eslint: {
    config: {
      stylistic: true
    }
  },
  icon: {
    customCollections: [
      {
        prefix: 'custom',
        dir: resolve('./app/assets/icons')
      }
    ]
  }
})
