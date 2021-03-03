import App from './App.vue'
import { createSSRApp } from 'vue'
import { createRouter } from './router'

import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { DefaultApolloClient } from '@vue/apollo-composable'

const defaultClient = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache()
})


// SSR requires a fresh app instance per request, therefore we export a function
// that creates a fresh app instance. If using Vuex, we'd also be creating a
// fresh store here.
export function createApp() {
  const app = createSSRApp(App)
  const router = createRouter()
  app.use(router)
  // Creates a apollo client instance
  app.provide(DefaultApolloClient, defaultClient)
  return { app, router }
}
