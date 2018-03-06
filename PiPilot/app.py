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

import logging
import os

from twisted.application.internet import TCPServer
from twisted.application.service import MultiService, IServiceMaker
from twisted.python import log, usage
from zope.interface import implementer
from twisted.web import server

from .controller import Controller
from .config import Config
from .utils import exc_repr
from .webservice import WebApp


#-------------------------------------------------------------------------------
class PiPilotOptions(usage.Options):
    optParameters = [
        ['config', 'c', '~/scrapy-do/config', 'A configuration file to load'],
    ]


#-------------------------------------------------------------------------------
@implementer(IServiceMaker)
class PiPilotServiceMaker():

    tapname = 'pipilot'
    description = 'A software aircraft controller for RaspberryPi'
    options = PiPilotOptions

    #---------------------------------------------------------------------------
    def makeService(self, options):
        top_service = MultiService()
        config_file = os.path.expanduser(options['config'])
        config = Config([config_file])

        #-----------------------------------------------------------------------
        # Set up the controller
        #-----------------------------------------------------------------------
        try:
            controller = Controller(config)
            controller.setServiceParent(top_service)
        except Exception as e:
            log.msg(format="Unable to set up the controller: %(reason)s",
                    reason=exc_repr(e), logLevel=logging.ERROR)
            return top_service

        #-----------------------------------------------------------------------
        # Set up the web server
        #-----------------------------------------------------------------------
        try:
            web_app = WebApp(config, controller)
            site = server.Site(web_app)
            interface = config.get_string('web', 'interface')
            port = config.get_int('web', 'port')
            web_server = TCPServer(port, site, interface=interface)
            web_server.setServiceParent(top_service)

            if ':' in interface:
                interface = '[{}]'.format(interface)
            log.msg(format="PiPilot web interface is available at "
                           "http://%(interface)s:%(port)s/",
                    interface=interface, port=port)

        except Exception as e:
            log.msg(format="Scrapy-Do web interface could not have been "
                           "configured: %(reason)s",
                    reason=exc_repr(e), logLevel=logging.ERROR)
            return top_service

        return top_service
