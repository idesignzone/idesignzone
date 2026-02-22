export default defineNuxtConfig({
  modules: ['@nuxt/ui'],
  compatibilityDate: '2025-01-01',
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
        class: 'js',
      },
      link: [
        { rel: 'stylesheet', href: 'https://use.typekit.net/biu0hfr.css' },
      ],
    },
  },
})
