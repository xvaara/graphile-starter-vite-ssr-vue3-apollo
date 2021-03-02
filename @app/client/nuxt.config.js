const webpack = require("webpack");
require("@app/config");
const { ROOT_URL, T_AND_C_URL } = process.env;

module.exports = {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: '@app/client',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/apollo',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
  ],

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    plugins: [
      new webpack.DefinePlugin({
        "process.env.ROOT_URL": JSON.stringify(
          ROOT_URL || "http://localhost:5678"
        ),
        "process.env.T_AND_C_URL": JSON.stringify(T_AND_C_URL || null),
      })
    ]
  },
  dev: process.env.NODE_ENV === "development",
  rootDir: `${__dirname}`,
  telemetry: false,
  apollo: {
    clientConfigs: {
      default: "~/plugins/apollo.js"
    }
  },
}
