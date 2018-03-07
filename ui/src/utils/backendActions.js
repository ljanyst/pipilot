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

import { backend } from './Backend';

//------------------------------------------------------------------------------
// Update throttle
//------------------------------------------------------------------------------
export function updateThrottle(value) {
  return backend.sendMessage({
    action: 'STEERING_UPDATE',
    channel: 0,
    value
  }, false);
}

//------------------------------------------------------------------------------
// Update yaw
//------------------------------------------------------------------------------
export function updateYaw(value) {
  return backend.sendMessage({
    action: 'STEERING_UPDATE',
    channel: 1,
    value
  }, false);
}

//------------------------------------------------------------------------------
// Update roll
//------------------------------------------------------------------------------
export function updateRoll(value) {
  return backend.sendMessage({
    action: 'STEERING_UPDATE',
    channel: 2,
    value
  }, false);
}

//------------------------------------------------------------------------------
// Update pitch
//------------------------------------------------------------------------------
export function updatePitch(value) {
  return backend.sendMessage({
    action: 'STEERING_UPDATE',
    channel: 3,
    value
  }, false);
}

//------------------------------------------------------------------------------
// Update accessory 0
//------------------------------------------------------------------------------
export function updateAcc0(value) {
  return backend.sendMessage({
    action: 'STEERING_UPDATE',
    channel: 4,
    value
  }, false);
}

//------------------------------------------------------------------------------
// Update accessory 1
//------------------------------------------------------------------------------
export function updateAcc1(value) {
  return backend.sendMessage({
    action: 'STEERING_UPDATE',
    channel: 5,
    value
  }, false);
}

//------------------------------------------------------------------------------
// Update accessory 2
//------------------------------------------------------------------------------
export function updateAcc2(value) {
  return backend.sendMessage({
    action: 'STEERING_UPDATE',
    channel: 6,
    value
  }, false);
}

//------------------------------------------------------------------------------
// Update accessory 3
//------------------------------------------------------------------------------
export function updateAcc3(value) {
  return backend.sendMessage({
    action: 'STEERING_UPDATE',
    channel: 7,
    value
  }, false);
}
