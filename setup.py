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
import sys
import os

from setuptools.command.build_py import build_py
from distutils.spawn import find_executable
from setuptools import setup
from subprocess import Popen
from PiPilot import __version__
from shutil import copyfile, rmtree

#-------------------------------------------------------------------------------
# Package description
#-------------------------------------------------------------------------------
with open('README.rst') as readme:
    long_description = readme.read()


#-------------------------------------------------------------------------------
# Run command
#-------------------------------------------------------------------------------
def run_command(args, cwd):
    p = Popen(args, cwd=cwd)
    p.wait()
    return p.returncode


#-------------------------------------------------------------------------------
# Build the React web app
#-------------------------------------------------------------------------------
class build_ui(build_py):
    def run(self):
        if not self.dry_run:

            #-------------------------------------------------------------------
            # Check and set the environment up
            #-------------------------------------------------------------------
            target_dir = os.path.join(self.build_lib, 'scrapy_do', 'ui')

            if os.path.exists(target_dir):
                rmtree(target_dir)

            ui_path = os.path.join(os.getcwd(), 'ui')
            if not os.path.exists(ui_path):
                print('[!] The ui directory does not exist')
                sys.exit(1)

            npm = find_executable('npm')
            if npm is None:
                print('[!] You need to have node installed to build this app')
                sys.exit(1)

            #-------------------------------------------------------------------
            # Build the JavaScript code
            #-------------------------------------------------------------------
            ret = run_command([npm, 'install'], ui_path)
            if ret != 0:
                print('[!] Installation of JavaScript dependencies failed')
                sys.exit(1)

            ret = run_command([npm, 'run-script', 'build'], ui_path)
            if ret != 0:
                print('[!] Build of JavaScript artefacts failed')
                sys.exit(1)

            #-------------------------------------------------------------------
            # Create a list of artefacts
            #-------------------------------------------------------------------
            artefacts = [
                'asset-manifest.json',
                'favicon.png',
                'index.html',
                'manifest.json',
                'service-worker.js'
            ]

            build_dir = 'ui/build'
            asset_manifest = os.path.join(build_dir, artefacts[0])
            if not os.path.exists(asset_manifest):
                print('[!] Asset manifest does not exist.')
                sys.exit(1)

            assets = json.loads(open(asset_manifest, 'r').read())
            for _, asset in assets.items():
                artefacts.append(asset)

            #-------------------------------------------------------------------
            # Copy the artefacts to the dist root
            #-------------------------------------------------------------------
            print('Copying JavaScript artefacts to', target_dir)
            for artefact in artefacts:
                source_file = os.path.join(build_dir, artefact)
                target_file = os.path.join(target_dir, artefact)
                target_prefix = os.path.dirname(target_file)
                if not os.path.exists(target_prefix):
                    os.makedirs(target_prefix)
                copyfile(source_file, target_file)

        build_py.run(self)

#-------------------------------------------------------------------------------
# Setup
#-------------------------------------------------------------------------------
setup(
    name = 'PiPilot',
    version = __version__,
    author = 'Lukasz Janyst',
    author_email = 'xyz@jany.st',
    url = 'https://jany.st/pipilot.html',
    description = 'A software aircraft controller for RaspberryPi',
    long_description = long_description,
    license = 'GPL3 license',
    packages = ['PiPilot'],
    include_package_data = True,
    cmdclass={
        'build_py': build_ui
    },
    package_data={
        '': ['*.conf'],
    },
    scripts=['pipilot'],
    classifiers = [
        'Development Status :: 2 - Pre-Alpha',
        'License :: OSI Approved :: GNU General Public License v3 (GPLv3)',
        'Operating System :: Unix',
        'Topic :: Scientific/Engineering :: Human Machine Interfaces',
        'Intended Audience :: Developers',
        'Intended Audience :: Science/Research',
        'Operating System :: OS Independent',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.6',
        'Environment :: Console',
        'Environment :: No Input/Output (Daemon)',
        'Environment :: Web Environment'
    ],
    install_requires = [
        'twisted', 'pyserial', 'autobahn'
    ]
)
