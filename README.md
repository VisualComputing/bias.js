BIAS
====

# Introduction

**BIAS**, (**B**)ogus-(**I**)nput (**A**)ction-(**S**)elector package. A [Processing](http://processing.org) package
defining an interface between application event input data (including but not limited to hardware input) and user-defined
actions. The idea being that various sorts of input data, mainly that gathered from an user-interaction (e.g., a mouse
button being pressed and dragged), may be modeled and reduced into high-level events. Those "bogus" events are then taken
as input to implement user-defined actions on application objects (e.g., push that button or select that geometry on the
screen and move it close to me).

**BIAS** has been tested under Linux, Mac OSX and Windows. No special dependencies or requirements needed, apart of course from
[Processing >= 2.x](https://processing.org/download/).

**BIAS** support is led by the active and great Processing community at its [forum](http://forum.processing.org/two/) where you can reach us.

# Key features

* *Tested* under Linux, Mac OSX and Windows, and properly works with the JAVA2D, P2D and P3D **Processing** renderers. No special dependencies or requirements needed (apart of course from [Processing-2.x](http://processing.org/ Processing-1.5.1)).
* It supports all major **Processing** flavours: Desktop, Android and (soon) JS.
* API design that provides seemless integration with **Processing**, and allows extensibility of its key features.
* Generic support to [Human Interface Devices (HIDs)](http://en.wikipedia.org/wiki/Human_interface_device), including not only the mouse and the keyboard, but advanced HID's such as a [touchscreen](http://en.wikipedia.org/wiki/Touchscreen), a [space navigator](http://en.wikipedia.org/wiki/3Dconnexion) or a [kinect](http://en.wikipedia.org/wiki/Kinect).
* User-defined actions, including action sub-sets.
* Comprehensive set of [bogus events](http://otrolado.info/biasApi/remixlab/bias/core/BogusEvent.html): [KeyboardEvent](http://otrolado.info/biasApi/remixlab/bias/event/KeyboardEvent.html), [ClickEvent](http://otrolado.info/biasApi/remixlab/bias/event/ClickEvent.html) and [MotionEvent](http://otrolado.info/biasApi/remixlab/bias/event/MotionEvent.html).
* High-level [comprehensive set of agents](http://otrolado.info/biasApi/remixlab/bias/agent/package-summary.html) capable of dealing with bogus events.
* Keyboard shortcuts and HID bindings customization.
* Handy set of complete documented [examples](https://github.com/nakednous/bias/wiki) that illustrates the use of the package.
* A complete [reference documentation](http://otrolado.info/biasApi/).
* Active support and continuous discussions led by the [Processing community](http://forum.processing.org/two/).
* Last but not least, released as free software under the terms of the [GPL-v3](http://www.gnu.org/licenses/gpl.html).

# Targeted applications

Depending on whether or not the user defines her own set of actions, **BIAS** targeted applications are:

## Action-less applications

Action-less applications simple require to reduce input data into a raw [BogusEvent](http://otrolado.info/biasApi/remixlab/bias/core/BogusEvent.html).

## Action-driven applications

In this case, the targeted applications for the package are those able to:

1. Itemize the application functionality into a list of actions (see [Action](http://otrolado.info/biasApi/remixlab/bias/core/Action.html)).
2. Reduce input data into a [BogusEvent](http://otrolado.info/biasApi/remixlab/bias/core/BogusEvent.html) and characterize it with a
[Shortcut](http://otrolado.info/biasApi/remixlab/bias/event/shortcut/Shortcut.html) (which are used to bind the user-defined
[Actions](http://otrolado.info/biasApi/remixlab/bias/core/Action.html)).
3. Implement each action item taking as input those (reduced) BogusEvents (see [Grabber](http://otrolado.info/biasApi/remixlab/bias/core/Grabber.html)
and [BogusEvent](http://otrolado.info/biasApi/remixlab/bias/core/BogusEvent.html)).

Observation: Third parties may not always need to implement their own [BogusEvents](http://otrolado.info/biasApi/remixlab/bias/core/BogusEvent.html)
but simply use (depart from) those already conveniently provided here:

1. [KeyboardEvent](http://otrolado.info/biasApi/remixlab/bias/event/KeyboardEvent.html), representing any keyboard.
2. [ClickEvent](http://otrolado.info/biasApi/remixlab/bias/event/ClickEvent.html) which stands for a button clicked.
3. [MotionEvent](http://otrolado.info/biasApi/remixlab/bias/event/MotionEvent.html) which represents data gathered from user motion, e.g., the user moves her
hand in front of a kinect, or a finger is being dragged on a touch screen surface. MotionEvents were modeled
according to their ["degrees-of-freedom (DOFs)"](http://en.wikipedia.org/wiki/Degrees_of_freedom_(mechanics)) (see
[DOF1Event](http://otrolado.info/biasApi/remixlab/bias/event/DOF1Event.html), [DOF2Event](http://otrolado.info/biasApi/remixlab/bias/event/DOF2Event.html),
[DOF3Event](http://otrolado.info/biasApi/remixlab/bias/event/DOF3Event.html) and [DOF6Event](http://otrolado.info/biasApi/remixlab/bias/event/DOF6Event.html)),
not only because they (DOF's) represent a nice property to classify input devices, but mainly because manipulating stuff on 3D may be performed differently
given events carrying different DOF's. Intuitively, the greater the DOF's the richer the user experience may be.

These default bogus-event set should serve as a common ground to all sorts of tangible interfaces manipulating geometry on a 2D/3D space.

# Usage

Usage is simple:

1. Instantiate an [InputHandler](http://otrolado.info/biasApi/remixlab/bias/core/InputHandler.html).
2. Define your bogus events.
3. Define/implement some [Agents](http://otrolado.info/biasApi/remixlab/bias/core/Agent.html) capable of dealing with your events and register them 
at the handler (see [registerAgent(Agent)](http://otrolado.info/biasApi/remixlab/bias/core/InputHandler.html#registerAgent(remixlab.bias.core.Agent))).
4. Action-driven applications should additionally implement user-defined actions (see 
[performInteraction(BogusEvent)](http://otrolado.info/biasApi/remixlab/bias/core/Grabber.html#performInteraction(remixlab.bias.core.BogusEvent))).
In this case, to customize the user experience simply bind bogus event [Shortcuts](http://otrolado.info/biasApi/remixlab/bias/event/shortcut/Shortcut.html) 
(see [shortcut()](http://otrolado.info/biasApi/remixlab/bias/core/BogusEvent.html#shortcut())) to user-defined actions using the Agent
[Profiles](http://otrolado.info/biasApi/remixlab/bias/agent/profile/Profile.html).
5. Attach a call to [handle()](http://otrolado.info/biasApi/remixlab/bias/core/InputHandler.html#handle()) at the end of your main event (drawing) loop.

# Installation

Download it [here](https://github.com/nakednous/bias/releases/download/v-1.0.0/bias-1.0.0.zip) and extract it to your sketchbook `libraries` folder.

For detailed Processing third party library installation instructions check [here](http://wiki.processing.org/w/How_to_Install_a_Contributed_Library#Manual_Install).

**Note** that **BIAS** provides input handling to [Proscene-2](http://nakednous.github.io/projects/proscene/) and is packaged along side with it.
This *stand-alone* release is thus incompatible with [Proscene-2](http://nakednous.github.io/projects/proscene/). If you've already installed
[Proscene-2](http://nakednous.github.io/projects/proscene/) you don't need to install **BIAS**, but can just try the [examples](https://github.com/nakednous/bias/tree/master/examples).
Otherwise, you may uninstall [Proscene-2](http://nakednous.github.io/projects/proscene/) first and then install ***BIAS**.

# Documentation

* [Wiki](https://github.com/nakednous/bias/wiki) containing a tutorial.
* [API](http://otrolado.info/biasApi) which is also available with the release zip file.

# Author, core developer and maintainer

[Jean Pierre Charalambos](http://disi.unal.edu.co/profesores/pierre/), [National University of Colombia](http://www.unal.edu.co)
