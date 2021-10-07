import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {Store} from './context';
import Header from './components/Header';
import HomeScreen from './components/HomeScreen';
import DecksScreen from './components/DecksScreen';
import ManageDeck from './components/ManageDeck';
import ResourcesScreen from './components/ResourcesScreen';

export default function App() {
  return (
    <Store>
      <Router>
        {/* Everything at this level is 'equal,' so all non-routes can kind of co-exist here as imported components */}
        {/* e.g. an Alert component */}
        <Header />
        <Route exact path='/' component={HomeScreen} />
        <Route exact path='/decks' component={DecksScreen} />
        <Route exact path='/manage_deck' component={ManageDeck} />
        <Route exact path='/resources' component={ResourcesScreen} />
      </Router>
    </Store>
  )
}