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

import serial

from twisted.application.service import Service
from twisted.internet.task import LoopingCall
from twisted.logger import Logger
from .sbus import SBUSEncoder

#-------------------------------------------------------------------------------
class Controller(Service):
    log = Logger()

    #---------------------------------------------------------------------------
    def __init__(self, config):
        #-----------------------------------------------------------------------
        # Configuration
        #-----------------------------------------------------------------------
        self.log.info('Creating controller')
        self.config = config
        tty_file = config.get_string('pipilot', 'sbus-uart-tty')

        #-----------------------------------------------------------------------
        # Set up the SBUS encoder and open the serial port
        #-----------------------------------------------------------------------
        self.encoder = SBUSEncoder()
        self.port = serial.Serial(tty_file, baudrate=100000,
                                  parity=serial.PARITY_EVEN,
                                  stopbits=serial.STOPBITS_TWO)

        #-----------------------------------------------------------------------
        # Set up the service
        #-----------------------------------------------------------------------
        self.setName('Controller')
        self.sbus_loop = LoopingCall(self.send_sbus_msg)

    #---------------------------------------------------------------------------
    def startService(self):
        self.log.info('Starting controller')
        self.sbus_loop.start(0.07)

    #---------------------------------------------------------------------------
    def stopService(self):
        self.log.info('Stopping controller')
        self.sbus_loop.stop()

    #---------------------------------------------------------------------------
    def send_sbus_msg(self):
        self.port.write(self.encoder.get_data())

    #---------------------------------------------------------------------------
    def update_channel(self, channel, value):
        scale = value + 100.
        scale /= 200
        self.encoder.set_channel(channel, int(scale * 2047))
