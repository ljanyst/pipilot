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
import './index.css';
import PiPilotApp from './components/PiPilotApp';
import registerServiceWorker from './registerServiceWorker';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';

import { backendReducer } from './reducers/backend';

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
// The App component
//------------------------------------------------------------------------------
ReactDOM.render(
  <Provider store={store}>
      <PiPilotApp />
  </Provider>,
  document.getElementById('root'));

registerServiceWorker();
