import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {Store} from './context';
import {HomeScreen} from './components/HomeScreen';

export default function App() {
  return (
    <Store>
      <Router>
        {/* Everything at this level is 'equal,' so all non-routes can kind of co-exist here as imported components */}
        {/* e.g. an Alert component */}
        <Route exact path='/' component={HomeScreen} />
      </Router>
    </Store>
  )
}