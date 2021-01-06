import React, {useContext} from 'react'
import {IdentityContext} from '../../identity-context'
const Dash = () => {
  const {user} = useContext(IdentityContext)
  return (
    <div>
      <h1>Dashboard Page</h1>
      <button
        onClick={async () => {
          const link = await fetch('/.netlify/functions/get-portal-url', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${user.token.access_token}`,
            },
          }).then((res) => res.json())
          window.location.href = link
        }}
      >
        Manage Subscription
      </button>
    </div>
  )
}

export default Dash
