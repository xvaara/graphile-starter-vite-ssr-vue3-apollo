import App from './App.vue'
import { createSSRApp } from 'vue'
import { createRouter } from './router'
import { createClient } from 'villus';

// SSR requires a fresh app instance per request, therefore we export a function
// that creates a fresh app instance. If using Vuex, we'd also be creating a
// fresh store here.
export function createApp() {
  const app = createSSRApp(App)
  const router = createRouter()
  app.use(router)
  // Creates a villus client instance
  const client = createClient({
    url: '/graphql', // your endpoint.
  });

  // Makes the villus client available to your app
  app.use(client);
  return { app, router }
}
