import React, {useContext} from 'react'
import {useQuery} from '@apollo/react-hooks'
import gql from 'graphql-tag'

import {IdentityContext} from '../../identity-context'
const GET_CONTENT_QUERY = gql`
  query GetContent {
    content {
      content
      title
    }
  }
`

const Content = () => {
  const {loading, error, data} = useQuery(GET_CONTENT_QUERY)

  if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>
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
