#-------------------------------------------------------------------------------
# Author: Lukasz Janyst <lukasz@jany.st>
# Date:   06.03.2018
#-------------------------------------------------------------------------------
# This file is part of PiPilot.
#
# PiPilot is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# PiPilot is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with PiPilot.  If not, see <http://www.gnu.org/licenses/>.
#-------------------------------------------------------------------------------

import json

from autobahn.twisted.websocket import WebSocketServerProtocol
from autobahn.twisted.websocket import WebSocketServerFactory
from twisted.logger import Logger


#-------------------------------------------------------------------------------
class WSFactory(WebSocketServerFactory):
    """
    Server factory producing configured WSProtocol objects.
    """

    #---------------------------------------------------------------------------
    def __init__(self, *args, **kwargs):
        self.controller = kwargs.pop('controller')
        super(WSFactory, self).__init__(*args, **kwargs)

    #---------------------------------------------------------------------------
    def buildProtocol(self, addr):
        protocol = super(WSFactory, self).buildProtocol(addr)
        protocol.controller = self.controller
        return protocol


#-------------------------------------------------------------------------------
class WSProtocol(WebSocketServerProtocol):

    wslog = Logger()

    #---------------------------------------------------------------------------
    def __init__(self, *args, **kwargs):
        super(WSProtocol, self).__init__(*args, **kwargs)
        self.actionHandlers = {}
        self.actionHandlers['STEERING_UPDATE'] = self.steering_update

    #---------------------------------------------------------------------------
    def onOpen(self):
        pass

    #---------------------------------------------------------------------------
    def onMessage(self, payload, isBinary):
        #-----------------------------------------------------------------------
        # Check the message validity
        #-----------------------------------------------------------------------
        if isBinary:
            return

        #-----------------------------------------------------------------------
        # Decode the message
        #-----------------------------------------------------------------------
        try:
            payload = payload.decode('utf-8')
            data = json.loads(payload)
        except Exception as e:
            self.wslog.debug('Unable to parse message: {}.'.format(str(e)))
            return

        for header in ['type', 'action']:
            if header not in data:
                msg = 'Header "{}" is missing.'.format(header)
                self.wslog.debug(msg)
                return

        if data['type'] != 'ACTION_NO_RESP':
            msg = 'Rejecting non-action message: {}.'.format(data['type'])
            self.wslog.debug(msg)
            self.send_error_response(data['id'], msg)
            return

        if data['action'] not in self.actionHandlers:
            msg = 'Unknown action: {}.'.format(data['action'])
            self.wslog.debug(msg)
            self.send_error_response(data['id'], msg)
            return

        #-----------------------------------------------------------------------
        # Execute the action
        #-----------------------------------------------------------------------
        self.actionHandlers[data['action']](data)

    #---------------------------------------------------------------------------
    def onClose(self, wasClean, code, reason):
        pass

    #---------------------------------------------------------------------------
    def has_fields(self, data, fields):
        for field in ['channel', 'value']:
            if field not in data:
                msg = 'Message for action {}: field "{}" not specified.' \
                    .format(data['action'], field)
                self.wslog.debug(msg)
                return False
        return True

    #---------------------------------------------------------------------------
    def steering_update(self, data):
        if not self.has_fields(data, ['channel', 'value']):
            return

        try:
            self.controller.update_channel(data['channel'], data['value'])
        except Exception as e:
            pass
