import React, {useContext} from 'react'
import {Link} from 'gatsby'
import {IdentityContext} from '../../identity-context'

const UserInfo = () => {
  const {user, netlifyIdentity} = useContext(IdentityContext)
  if (!user) {
    return null
  }
  console.log(user)
  return (
    <div>
      <p>Welcome {user.user_metadata.full_name}</p>
      <p>Plan: {user.app_metadata.role[0]}</p>
      <button
        onClick={() => {
          netlifyIdentity.logout()
        }}
      >
        Logout
      </button>
    </div>
  )
}
const Layout = ({children}) => {
  return (
    <>
      <header>
        <h1>JAMSaas</h1>
        <UserInfo />
        <nav>
          <Link to="/">Home</Link> {' | '}
          <Link to="/app/dashboard">Dashboard</Link>
        </nav>
      </header>
      <main>{children}</main>
    </>
  )
}

export default Layout
