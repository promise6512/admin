import React, { Component } from 'react'
import { BrowserRouter, Route,Switch } from 'react-router-dom'
import './App.less'
import Login from './pages/login/login'
import Admin from './pages/admin/admin'
export default class App extends Component {
  render() {
    console.log('app')
    return (
      <BrowserRouter>
        <Switch>
          <Route path='/login' component={Login}></Route>
          <Route path='/' component={Admin}></Route>
        </Switch>
      </BrowserRouter>
    )
  }
}
