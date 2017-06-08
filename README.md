bias.js
====

# Introduction

**bias.js**, (**B**)ogus-(**I**)nput (**A**)ction-(**S**)elector package (**J**)ava-(**S**)cript. A [Processing](http://processing.org) package developed in Java Script that defines an interface between application event input data (including but not limited to hardware input) and user-defined actions. The idea being that various sorts of input data, mainly that gathered from an user-interaction (e.g., a mouse button being pressed and dragged), may be modeled and reduced into high-level events. Those "bogus" events are then taken
as input to implement user-defined actions on application objects (e.g., push that button or select that geometry on the
screen and move it close to me).

It is a traslation from the [Java Bias package](https://github.com/nakednous/bias) to Java Script. It follows the ECMAScript 2016 standard. 

# TODO

[ ] currently p5.js doesn't implement registerMethod('mouseEvent')

[ ] currently p5.js doesn't implement registerMethod('keyEvent')

[ ] find a way to test DOF6


# Development features

- Private variables starts with an underscore "_" (e.g., `_variable_name`).
- Classes are defined as "export default class", whether they are abstract or not, to export a module. It only exports single values, an ECMAScript 6 module can pick the most important exported value. 
- For multiple constructors with different number of parameters is used...
- For multiple constructors with the same number of parameters is used...
- The third party events [KeyboardEvent](http://otrolado.info/biasApi/remixlab/bias/event/KeyboardEvent.html) and [ClickEvent](http://otrolado.info/biasApi/remixlab/bias/event/ClickEvent.html) are not included in p5js library as they are in processing, because...

# Hacking

## Initial setup

This project uses [rollup](https://rollupjs.org/) as build system and
[esdoc](https://esdoc.org/) as documentation generator:

```sh
npm install --global rollup
npm install --global esdoc
```

there are 2 scripts available:

```sh
npm build # compiles fpstiming in a single file availabe on /build/fpstiming/.js
npm doc # generates the documentation on /doc folder
```

this project uses ES6 features, you can see an updated list of features
implemented in diferent transpilers or browsers [here](https://kangax.github.io/compat-table/es6/)

# Acknowledgements

[Jairo Suárez](https://github.com/xyos) for the js port.

# Author, core developer and maintainer

[Jean Pierre Charalambos](http://disi.unal.edu.co/profesores/pierre/), [National University of Colombia](http://www.unal.edu.co)
