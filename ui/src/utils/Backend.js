//------------------------------------------------------------------------------
// Author: Lukasz Janyst <lukasz@jany.st>
// Date: 30.01.2018
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

import { makeId } from './helpers';

//------------------------------------------------------------------------------
// Backend
//------------------------------------------------------------------------------
export class Backend {
  //----------------------------------------------------------------------------
  // Constants
  //----------------------------------------------------------------------------
  static CONNECTING = 0;
  static OPENED = 1;
  static CLOSED = 2;
  static MSG_RECEIVED = 3;
  static COUNTDOWN = 4;

  static REMOVE_LISTENER = 0;

  //----------------------------------------------------------------------------
  // Constructor
  //----------------------------------------------------------------------------
  constructor() {
    const loc = window.location;
    const wsProtocol = loc.protocol === 'https:' ? 'wss:' : 'ws:';
    this.wsUrl =
      process.env.NODE_ENV === 'production'
        ? `${wsProtocol}//${loc.host}/ws`
        : 'ws://rpi2-wifi:5005/ws';

    this.ws = null;
    this.countdownTimer = null;
    this.countdown = 0;
    this.nextTry = 2;
    this.eventListeners = new Set();
    this.connect();
  }

  //----------------------------------------------------------------------------
  // Connect
  //----------------------------------------------------------------------------
  connect = () => {
    //--------------------------------------------------------------------------
    // Check and clear the existing state
    //--------------------------------------------------------------------------
    if(this.ws)
      throw Error('Socket not closed');

    if(this.countdownTimer)
      clearInterval(this.countdownTimer);

    //--------------------------------------------------------------------------
    // Attempt the connection
    //--------------------------------------------------------------------------
    this.dispatchEvent(Backend.CONNECTING, null);

    this.ws = new WebSocket(this.wsUrl);

    //--------------------------------------------------------------------------
    // On open
    //--------------------------------------------------------------------------
    this.ws.onopen = () => {
      this.dispatchEvent(Backend.OPENED, null);
      this.nextTry = 2;
    };

    //--------------------------------------------------------------------------
    // On Message
    //--------------------------------------------------------------------------
    this.ws.onmessage = (evt) => {
      const message = JSON.parse(evt.data);
      this.dispatchEvent(Backend.MSG_RECEIVED, message);
    };

    //--------------------------------------------------------------------------
    // On Close
    //--------------------------------------------------------------------------
    this.ws.onclose = () => {
      this.dispatchEvent(Backend.CLOSED, null);

      this.ws = null;
      this.nextTry *= 2;
      if(this.nextTry > 256)
        this.nextTry = 256;
      this.countdown = this.nextTry - 1;

      this.dispatchEvent(Backend.COUNTDOWN, this.countdown + 1);

      const tick = () => {
        this.dispatchEvent(Backend.COUNTDOWN, this.countdown);
        if(this.countdown === 0) {
          this.connect();
          return;
        }
        this.countdown -= 1;
      };
      this.countdownTimer = setInterval(tick, 1000);
    };
  };

  //----------------------------------------------------------------------------
  // Add event listener
  //----------------------------------------------------------------------------
  addEventListener = (listener) => {
    this.eventListeners.add(listener);
  }

  //----------------------------------------------------------------------------
  // Remove an event listener
  //----------------------------------------------------------------------------
  removeEventListener = (listener) => {
    this.eventListeners.delete(listener);
  }

  //----------------------------------------------------------------------------
  // Dispatch event
  //----------------------------------------------------------------------------
  dispatchEvent = (event, data) => {
    let toRemove = [];
    for(const listener of this.eventListeners) {
      let ret = listener(event, data);
      if(ret === Backend.REMOVE_LISTENER)
        toRemove.push(listener);
    }
    for(const listener of toRemove)
      this.removeEventListener(listener);
  }

  //----------------------------------------------------------------------------
  // Send message
  //----------------------------------------------------------------------------
  sendMessage = (message, expectResponse = true) => {
    //--------------------------------------------------------------------------
    // Only send messages if we're connected
    //--------------------------------------------------------------------------
    if(!this.ws || this.ws.readyState !== WebSocket.OPEN)
      return Promise.reject(new Error('Backend not connected.'));

    //--------------------------------------------------------------------------
    // Wrap the message
    //--------------------------------------------------------------------------
    let newMessage = null;
    const id = makeId(32);
    if(expectResponse) {
      newMessage = Object.assign(message, {
        type: 'ACTION',
        id
      });
    }
    else {
      newMessage = Object.assign(message, {
        type: 'ACTION_NO_RESP'
      });
      this.ws.send(JSON.stringify(newMessage));
      return Promise.resolve({});
    }

    return new Promise((resolve, reject) => {
      //------------------------------------------------------------------------
      // Listener handling the answer
      //------------------------------------------------------------------------
      const listener = (event, data) => {
        //----------------------------------------------------------------------
        // Disconnected, the answer will never arrive
        //----------------------------------------------------------------------
        if(event === Backend.CLOSED) {
          reject(new Error('Backend disconnected'));
          return Backend.REMOVE_LISTENER;
        }

        //----------------------------------------------------------------------
        // We got the response
        //----------------------------------------------------------------------
        if(event === Backend.MSG_RECEIVED && data.type === 'ACTION_EXECUTED'
           && data.id === id) {

          if(data.status === 'OK') {
            let cleanData = Object.assign(data);
            delete cleanData.type;
            delete cleanData.id;
            delete cleanData.status;
            resolve(cleanData);
          }
          else
            reject(new Error(data.message));

          return Backend.REMOVE_LISTENER;
        }

        return null;
      };

      //------------------------------------------------------------------------
      // Register the resposne listener and send the message
      //------------------------------------------------------------------------
      this.addEventListener(listener);
      this.ws.send(JSON.stringify(newMessage));
    });
  }
};

//------------------------------------------------------------------------------
// The backend
//------------------------------------------------------------------------------
export let backend = new Backend();
