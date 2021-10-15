// windicss layers
import 'virtual:windi-base.css'
import 'virtual:windi-components.css'
// your custom styles here
import './styles/main.css'
// windicss utilities should be the last style import
import 'virtual:windi-utilities.css'

// if (!import.meta.env.SSR) {
//   // windicss devtools support (dev only)
//   import 'virtual:windi-devtools'
// }
import { InMemoryCache } from '@apollo/client'
import { provideApolloClient } from '@vue/apollo-composable'
import { createApolloProvider } from '@vue/apollo-option'
import { createHead } from '@vueuse/head'
// @ts-ignore
import generatedRoutes from 'virtual:generated-pages'
import viteSSR, { ClientOnly } from 'vite-ssr'

import { useSharedQuery } from '@app/graphql'
import App from './App.vue'

import { createApolloClient } from './withApollo'
import { useResult } from './utils/apollo'

// @ts-ignore
// eslint-disable-next-line no-undef
if (__ROOT_URL__ === '') {
  console.log(import.meta.env)
  throw new Error('No ROOT_URL')
}

export default viteSSR(
  App,
  {
    routes: generatedRoutes,
    transformState(state, defaultTransformer) {
      if (import.meta.env.SSR) state.apolloCache = state.apolloCache.extract()

      return defaultTransformer(state)
    },
    pageProps: {
      passToPage: false,
    },
  },
  async(ctx) => {
    const { app, router, initialState, request, response } = ctx
    const head = createHead()
    app.use(head)

    app.component(ClientOnly.name, ClientOnly)

    // install all modules under `modules/`
    Object.values(import.meta.globEager('./modules/*.ts')).map(i =>
      i.install?.(ctx),
    )

    // The 'initialState' is hydrated in the browser and can be used to
    // pass it to Vuex, for example, if you prefer to rely on stores rather than page props.
    // In the server, 'initialState' is an empty object that can be mutated. It can be
    // passed to Vuex, or provide it to child components (see Homepage for an example).
    app.provide('initialState', initialState)
    if (import.meta.env.SSR) {
      // @ts-ignore
      initialState.csrfToken = request?.csrfToken()
      initialState.apolloCache = new InMemoryCache()
    }
    else {
      initialState.apolloCache = new InMemoryCache().restore(
        initialState.apolloCache,
      )
    }
    // @ts-ignore
    const ApolloLink = import.meta.env.SSR
      ? response.locals.GraphileApolloLink
      : null

    const defaultClient = createApolloClient(
      import.meta.env.SSR,
      initialState.apolloCache,
      ApolloLink,
      initialState.csrfToken,
    )

    provideApolloClient(defaultClient)

    const apolloProvider = createApolloProvider({
      defaultClient,
    })
    app.use(apolloProvider)

    router.beforeEach(async(to: any, from: any, next: any) => {
      // if (!!to.meta.state && (!import.meta.env.DEV || import.meta.env.SSR)) {
      //   // This route has state already (from server) so it can be reused.
      //   return next()
      // }

      // `isClient` here is a handy way to determine if it's SSR or not.
      // However, it is a runtime variable so it won't be tree-shaked.
      // Use Vite's `import.meta.env.SSR` instead for tree-shaking.

      // const baseUrl = isClient ? '' : url.origin
      // const currentUser = app.inject("currentUser");

      const { result } = await useSharedQuery({
        fetchPolicy: 'cache-first',
      })
      const currentUser = await useResult(result)
      console.log('route', currentUser.value)

      // Explanation:
      // The first rendering happens in the server. Therefore, when this code runs,
      // the server makes a request to itself (running the code below) in order to
      // get the current page props and use that response to render the HTML.
      // The browser shows this HTML and rehydrates the application, turning it into
      // a normal SPA. After that, subsequent route navigation runs this code below
      // from the browser and get the new page props, which is this time rendered
      // directly in the browser, as opposed to the first page rendering.

      // Get our page props from our custom API:
      // if (import.meta.env.SSR) {

      // }

      // During SSR, this is the same as modifying initialState
      // to.meta.state = user

      next()
    })
    // setTimeout(() => {
    // serverClient = undefined
    // response.locals.GraphileApolloLink = undefined
    // },1)

    return { head }
  },
)
