import React, { useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import './App.css';
import Dashboard from './components/Dashboard/Dashboard';
import Preferences from './components/Preferences/Preferences';
import Login from './components/Auth/Login'
import useToken from './components/App/useToken'

function App() {

  const {token, setToken} = useToken();
  if(!token) {
    return <Login setToken={setToken} />
  }
  return (
    <div className="wrapper">
      <h1>Application</h1>
      <BrowserRouter>
        <switch>
          <Route path='/dashboard'>
            <Dashboard />
          </Route>
          <Route path='/preferences'>
            <Preferences />
          </Route>
        </switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
