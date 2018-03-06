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

import mimetypes
import json

from autobahn.twisted.resource import WebSocketResource
from twisted.web import resource
from .websocket import WSFactory, WSProtocol
from pkgutil import get_data


#-------------------------------------------------------------------------------
class WebApp(resource.Resource):
    #---------------------------------------------------------------------------
    def __init__(self, config, controller):
        super(WebApp, self).__init__()
        self.config = config
        self.controller = controller
        self.children = {}

        #-----------------------------------------------------------------------
        # Set up the websocket
        #-----------------------------------------------------------------------
        ws_factory = WSFactory(controller=self.controller)
        ws_factory.protocol = WSProtocol
        ws_resource = WebSocketResource(ws_factory)
        self.putChild(b'ws', ws_resource)

        #-----------------------------------------------------------------------
        # Register UI modules
        #-----------------------------------------------------------------------
        assets = None
        try:
            assets = get_data(__package__, 'ui/asset-manifest.json')
            assets = assets.decode('utf-8')
        except FileNotFoundError:
            self.index = self

        if assets is not None:
            self.index = UIResource('ui/index.html')
            self.putChild(b'', self.index)

            children = [
                '/favicon.png',
                '/manifest.json',
            ]
            for child in children:
                self.register_child(child, UIResource('ui' + child))

            assets = json.loads(assets)
            for _, asset in assets.items():
                self.register_child('/' + asset, UIResource('ui/' + asset))

    #---------------------------------------------------------------------------
    def register_child(self, key, resource):
        key = key.encode('utf-8')
        self.children[key] = resource

    #---------------------------------------------------------------------------
    def getChild(self, name, request):
        if request.uri in self.children:
            return self.children[request.uri]
        return self.index

    #---------------------------------------------------------------------------
    def render_GET(self, request):
        data = b'The UI files have not been built.'
        request.setHeader('Content-Type', 'text/plain')
        request.setHeader('Content-Length', len(data))
        return data


#-------------------------------------------------------------------------------
class UIResource(resource.Resource):

    isLeaf = True

    #---------------------------------------------------------------------------
    def __init__(self, name):
        super(UIResource, self).__init__()
        self.name = name
        self.data = get_data(__package__, name)
        mimetype = mimetypes.guess_type(self.name)[0]
        self.mimetype = mimetype if mimetype else 'text/plain'

    #---------------------------------------------------------------------------
    def render_GET(self, request):
        request.setHeader('Content-Type', self.mimetype)
        request.setHeader('Content-Length', len(self.data))
        return self.data
