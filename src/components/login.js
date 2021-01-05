import React, {useContext} from 'react'
import {navigate} from 'gatsby'
import {IdentityContext} from '../../identity-context'

const Login = () => {
  const {identity: netlifyIdentity} = useContext(IdentityContext)
  netlifyIdentity.on('login', (user) => {
    navigate('/app/dashboard')
  })
  return (
    <div>
      <h1>Login Page</h1>
      <button
        onClick={() => {
          netlifyIdentity.open()
        }}
      >
        Log In
      </button>
    </div>
  )
}

export default Login
