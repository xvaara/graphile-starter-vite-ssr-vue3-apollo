// apollo.js

import { ApolloClient, HttpLink, split } from '@apollo/client/core'
// import { onError } from "@apollo/client/link/error";
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'

// Create the apollo client
/**
 * @param {any} cache
 * @param {any} apolloLink
 * @param {string} [csrfToken]
 */
export function createApolloClient(ssr = false, cache, apolloLink, csrfToken) {
  let link
  if (!import.meta.env.SSR && !link) {
    const httplink = new HttpLink({
      // You should use an absolute URL here
      // @ts-ignore
      // eslint-disable-next-line no-undef
      uri: `${__ROOT_URL__}/graphql`,
      // credentials: 'include', // use 'same-origin' if it is appropriate for your case
      // headers: { 'CSRF-Token': getToken() },
      headers: { 'CSRF-Token': csrfToken },
    })

    const wsLink = new WebSocketLink({
      // @ts-ignore
      // eslint-disable-next-line no-undef
      uri: `${__ROOT_URL__.replace(/^http/, 'ws')}/graphql`,
      options: {
        reconnect: true,
      },
    })

    // using the ability to split links, you can send data to each link
    // depending on what kind of operation is being sent

    link = split(
      // split based on operation type
      ({ query }) => {
        const definition = getMainDefinition(query)
        return (
          definition.kind === 'OperationDefinition'
          && definition.operation === 'subscription'
        )
      },
      wsLink,
      httplink,
    )
  }
  else {
    link = apolloLink
  }
  console.log('apollo ssr', ssr)
  const apolloClient = new ApolloClient({
    // link: from([errorLink, apolloLink ? apolloLink : httpLink]),
    link,
    cache,
    ...(
      ssr
        ? {
          // Set this on the server to optimize queries when SSR
          // ssrMode: true,
        }
        : {
          // This will temporary disable query force-fetching
          ssrForceFetchDelay: 100,
        }
    ),
  })

  return apolloClient
}
