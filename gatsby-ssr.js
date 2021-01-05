const React = require('react')
const {IdentityProvider} = require('./identity-context')

exports.wrapRootElement = ({element}) => {
  return <IdentityProvider>{element}</IdentityProvider>
}
