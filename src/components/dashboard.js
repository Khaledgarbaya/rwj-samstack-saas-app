import React, {useContext} from 'react'
import {useQuery} from '@apollo/react-hooks'
import gql from 'graphql-tag'

import {IdentityContext} from '../../identity-context'
const GET_CONTENT = gql`
  query Content {
    content {
      title
      content
    }
  }
`

const Content = () => {
  const {loading, error, data} = useQuery(GET_CONTENT)

  if (error) return <span>error!</span>
  if (loading) return <span>loading...</span>
  return (
    <ul>
      {data.content.map(({title}) => (
        <li>{title}</li>
      ))}
    </ul>
  )
}
const Dash = () => {
  const {user} = useContext(IdentityContext)
  return (
    <div>
      <h1>Dashboard Page</h1>
      <h2>Content</h2>
      <Content />
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
