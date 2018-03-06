//------------------------------------------------------------------------------
// Author: Lukasz Janyst <lukasz@jany.st>
// Date: 03.02.2018
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

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Alert } from 'react-bootstrap';

import { backend } from '../utils/Backend';
import { BACKEND_CONNECTING, BACKEND_OPENED } from '../actions/backend';

//------------------------------------------------------------------------------
// Backend status
//------------------------------------------------------------------------------
class BackendStatus extends Component {
  //----------------------------------------------------------------------------
  // Render
  //----------------------------------------------------------------------------
  render() {
    //--------------------------------------------------------------------------
    // We're okay
    //--------------------------------------------------------------------------
    if(this.props.status === BACKEND_OPENED)
      return (<div />);

    //--------------------------------------------------------------------------
    // Retrying
    //--------------------------------------------------------------------------
    if(this.props.status === BACKEND_CONNECTING)
      return (
        <div className='col-md-4 col-md-offset-4'>
          <Alert bsStyle='info' onClick={this.retryNow}>
            <div className='alert-content'>
              Connecting...
            </div>
          </Alert>
        </div>
      );

    //--------------------------------------------------------------------------
    // Error
    //--------------------------------------------------------------------------
    return (
      <div className='col-md-4 col-md-offset-4'>
        <Alert bsStyle='info' type='button'>
          <div className='alert-content'>
            Disconnected. Connecting in
            <strong> {this.props.countdown}</strong>
            {this.props.countdown === 1 ? ' second' : ' seconds'}.
            Click <a className='alert-link' onClick={(evt) => {
                evt.preventDefault();
                backend.connect();
              }} href='#n'>here</a> to
            try now.
          </div>
        </Alert>
      </div>
    );
  }
}

//------------------------------------------------------------------------------
// The redux connection
//------------------------------------------------------------------------------
function mapStateToProps(state, ownProps) {
  return {
    status: state.backend.status,
    countdown: state.backend.countdown
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(BackendStatus);
