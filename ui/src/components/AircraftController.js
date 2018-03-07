//------------------------------------------------------------------------------
// Author: Lukasz Janyst <lukasz@jany.st>
// Date: 06.03.2018
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

import 'rc-tooltip/assets/bootstrap.css';
import 'rc-slider/assets/index.css';

import React, { Component } from 'react';
import { connect } from 'react-redux';

import Slider from 'rc-slider';
import Tooltip from 'rc-tooltip';

import { BACKEND_OPENED } from '../actions/backend';
import {
  updateThrottle, updateYaw, updateRoll, updatePitch,
  updateAcc0, updateAcc1, updateAcc2, updateAcc3
} from '../utils/backendActions';

//------------------------------------------------------------------------------
// Tooltip Top
//------------------------------------------------------------------------------
const HandleTooltipTop = (props) => {
  const { value, dragging, index, ...restProps } = props;
  return (
    <Tooltip
      prefixCls="rc-slider-tooltip"
      overlay={`${value}%`}
      visible={dragging}
      placement="top"
      key={index}
    >
      <Slider.Handle value={value} {...restProps} />
    </Tooltip>
  );
};

//------------------------------------------------------------------------------
// Tooltip Left
//------------------------------------------------------------------------------
const HandleTooltipLeft = (props) => {
  const { value, dragging, index, ...restProps } = props;
  return (
    <Tooltip
      prefixCls="rc-slider-tooltip"
      overlay={`${value}%`}
      visible={dragging}
      placement="left"
      key={index}
    >
      <Slider.Handle value={value} {...restProps} />
    </Tooltip>
  );
};

//------------------------------------------------------------------------------
// Aircraft Controller
//------------------------------------------------------------------------------
class AircraftController extends Component {
  //----------------------------------------------------------------------------
  // Render
  //----------------------------------------------------------------------------
  render() {
    return (
      <div className='col-md-8 col-md-offset-2 ac'>
        <table className='ac'>
          <thead>
            <tr>
              <th className='ac'>Throttle</th>
              <th className='ac'>Yaw</th>
              <th className='ac'>Roll</th>
              <th className='ac'>Pitch</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className='ac'>
                <div className='ac-content'>
                  <div className='ac-content-box'>
                    <Slider
                      min={-100}
                      max={100}
                      defaultValue={0}
                      handle={HandleTooltipLeft}
                      vertical
                      onChange={updateThrottle}
                      disabled={!this.props.connected}
                    />
                  </div>
                </div>
              </td>
              <td className='ac'>
                <Slider
                  min={-100}
                  max={100}
                  defaultValue={0}
                  handle={HandleTooltipTop}
                  onChange={updateYaw}
                  disabled={!this.props.connected}
                />
              </td>
              <td className='ac'>
                <Slider
                  min={-100}
                  max={100}
                  defaultValue={0}
                  handle={HandleTooltipTop}
                  onChange={updateRoll}
                  disabled={!this.props.connected}
                />
              </td>
              <td className='ac'>
                <div className='ac-content'>
                  <div className='ac-content-box'>
                    <Slider
                      min={-100}
                      max={100}
                      defaultValue={0}
                      handle={HandleTooltipLeft}
                      vertical
                      onChange={updatePitch}
                      disabled={!this.props.connected}
                      />
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <table className='ac'>
          <thead>
            <tr>
              <th className='ac'>Accessory 0</th>
              <th className='ac'>Accessory 1</th>
              <th className='ac'>Accessory 2</th>
              <th className='ac'>Accessory 3</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className='ac'>
                <Slider
                  min={-100}
                  max={100}
                  defaultValue={0}
                  handle={HandleTooltipTop}
                  onChange={updateAcc0}
                  disabled={!this.props.connected}
                />
              </td>
              <td className='ac'>
                <Slider
                  min={-100}
                  max={100}
                  defaultValue={0}
                  handle={HandleTooltipTop}
                  onChange={updateAcc1}
                  disabled={!this.props.connected}
                />
              </td>
              <td className='ac'>
                <Slider
                  min={-100}
                  max={100}
                  defaultValue={0}
                  handle={HandleTooltipTop}
                  onChange={updateAcc2}
                  disabled={!this.props.connected}
                />
              </td>
              <td className='ac'>
                <Slider
                  min={-100}
                  max={100}
                  defaultValue={0}
                  handle={HandleTooltipTop}
                  onChange={updateAcc3}
                  disabled={!this.props.connected}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
//------------------------------------------------------------------------------
// The redux connection
//------------------------------------------------------------------------------
function mapStateToProps(state, ownProps) {
  return {
    connected: state.backend.status === BACKEND_OPENED
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(AircraftController);
