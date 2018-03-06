//------------------------------------------------------------------------------
// Author: Lukasz Janyst <lukasz@jany.st>
// Date:   06.03.2018
//------------------------------------------------------------------------------
// This file is part of PiPilot.
//
// PiPilot is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// PiPilot is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with PiPilot.  If not, see <http://www.gnu.org/licenses/>.
//------------------------------------------------------------------------------

import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import './index.css';
import PiPilotApp from './components/PiPilotApp';
import registerServiceWorker from './registerServiceWorker';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';

import { backendReducer } from './reducers/backend';
import {
  backendStatusSet, backendCountdownSet,
  BACKEND_CONNECTING, BACKEND_OPENED, BACKEND_CLOSED
} from './actions/backend';
import { backend, Backend } from './utils/Backend';

//------------------------------------------------------------------------------
// Redux store
//------------------------------------------------------------------------------
export const store = createStore(
  combineReducers({
    backend: backendReducer
  }),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

//------------------------------------------------------------------------------
// Make backend events change the state of the stare
//------------------------------------------------------------------------------
const backendStoreEvent = (event, data) => {
  if(event === Backend.CONNECTING)
    store.dispatch(backendStatusSet(BACKEND_CONNECTING));
  else if(event === Backend.OPENED)
    store.dispatch(backendStatusSet(BACKEND_OPENED));
  else if(event === Backend.CLOSED)
    store.dispatch(backendStatusSet(BACKEND_CLOSED));
  else if(event === Backend.COUNTDOWN)
    store.dispatch(backendCountdownSet(data));
};

backend.addEventListener(backendStoreEvent);

//------------------------------------------------------------------------------
// The App component
//------------------------------------------------------------------------------
ReactDOM.render(
  <Provider store={store}>
      <PiPilotApp />
  </Provider>,
  document.getElementById('root'));

registerServiceWorker();
