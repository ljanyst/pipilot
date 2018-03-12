
=======
PiPilot
=======

.. image:: https://img.shields.io/pypi/v/PiPilot.svg
   :target: https://pypi.python.org/pypi/PiPilot
   :alt: PyPI Version

PiPilot lets you control a drone from a web browser. It's been designed to work
with Raspberry Pi, hence its name. However, you can likely make it work with
anything that has UART. It should be able to interface with any autopilot board
capable of understanding the SBUS protocol.

The purpose of the project is to let the autopilot control the fundamental
behavior of a drone, i.e., attitude using gyros and accelerometers, and
provide functionality controlling velocity, altitude hold, and basic navigation
using more sophisticated sensors. We're not there yet.

.. figure:: https://github.com/ljanyst/pipilot/raw/master/assets/interface.png
   :scale: 50 %
   :alt: Interface

Inverter
--------

Since SBUS, in reality, is inverted UART, you cannot connect the wires directly.
You will need to build yourself an inverter.

.. figure:: https://github.com/ljanyst/pipilot/raw/master/assets/inverter.png
   :scale: 50 %
   :alt: Inverter

Installation
------------

.. code-block:: console

     $ pip install PiPilot
     $ pipilot -n pipilot

Test
----

.. figure:: https://img.youtube.com/vi/EUDdmXHwLbQ/0.jpg
   :scale: 50 %
   :alt: Test
   :target: https://www.youtube.com/watch?v=EUDdmXHwLbQ
