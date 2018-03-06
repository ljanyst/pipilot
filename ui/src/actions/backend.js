//------------------------------------------------------------------------------
// Author: Lukasz Janyst <lukasz@jany.st>
// Date: 06.02.2018
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

export const BACKEND_STATUS_SET = 'BACKEND_STATUS_SET';
export const BACKEND_COUNTDOWN_SET = 'BACKEND_COUNTDOWN_SET';

export const BACKEND_CONNECTING = 'BACKEND_CONNECTING';
export const BACKEND_OPENED = 'BACKEND_OPENED';
export const BACKEND_CLOSED = 'BACKEND_CLOSED';

export function backendStatusSet(status) {
  return {
    type: BACKEND_STATUS_SET,
    status
  };
}
export function backendCountdownSet(countdown) {
  return {
    type: BACKEND_COUNTDOWN_SET,
    countdown
  };
}
