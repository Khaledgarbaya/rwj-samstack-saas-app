import React from 'react'
import {Router} from '@reach/router'
import PrivateRoute from '../components/private-route'
import Login from '../components/login'
import Dash from '../components/dashboard'
import Layout from '../components/layout'

const Default = () => <h1>App Page</h1>

const App = () => {
  return (
    <Layout>
      <Router basepath="/app">
        <PrivateRoute component={Dash} path="/dashboard" />
        <Login path="/login" />
        <Default path="/" />
      </Router>
    </Layout>
  )
}
export default App
