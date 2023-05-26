import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './pages/home';
import FaceTec from './pages/face-tec';
import './App.css'
import NextStep from './pages/next-step';

function App() {
  return (
    <Router>

      <Switch>
        <Route path="/face-tec">
          <FaceTec />
        </Route>

        <Route path="/next-step">
          <NextStep />
        </Route>

        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
