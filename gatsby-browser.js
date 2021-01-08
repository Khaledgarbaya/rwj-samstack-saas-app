const React = require('react')
const {IdentityProvider} = require('./identity-context')

const {netlifyIdentity} = require('./identity-context.js')
const {ApolloProvider} = require('@apollo/react-hooks')
const {ApolloClient} = require('apollo-client')
const {createHttpLink} = require('apollo-link-http')
const {ApolloLink} = require('apollo-link')
const {InMemoryCache} = require('apollo-cache-inmemory')

const cache = new InMemoryCache()

const httpLink = createHttpLink({
  uri: process.env.GATSBY_HASURA_URL,
})
// inject auth
const middlewareLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      authorization:
        `Bearer ${netlifyIdentity.currentUser().token.access_token}` || null,
    },
  })
  return forward(operation)
})

// use with apollo-client
const link = middlewareLink.concat(httpLink)

const client = new ApolloClient({
  link,
  cache,
})

exports.wrapRootElement = ({element}) => {
  return (
    <ApolloProvider client={client}>
      <IdentityProvider>{element}</IdentityProvider>
    </ApolloProvider>
  )
}
