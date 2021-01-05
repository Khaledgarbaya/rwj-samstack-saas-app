import React from 'react'
import {Router} from '@reach/router'

const Login = () => <h1>Login Page</h1>
const Dash = () => <h1>Dashboard Page</h1>
const Default = () => <h1>App Page</h1>
const App = () => {
  return (
    <>
      <Router basepath="/app">
        <Dash path="/dashboard" />
        <Login path="/login" />
        <Default path="/" />
      </Router>
    </>
  )
}
export default App
