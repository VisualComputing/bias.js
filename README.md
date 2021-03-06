Bias.js
====

# Introduction

**BIAS.js**, (**B**)ogus-(**I**)nput (**A**)ction-(**S**)elector package (**J**)ava-(**S**)cript. A [Processing](http://processing.org) package developed in Java Script that defines an interface between application event input data (including but not limited to hardware input) and user-defined actions. The idea being that various sorts of input data, mainly that gathered from an user-interaction (e.g., a mouse button being pressed and dragged), may be modeled and reduced into high-level events. Those "bogus" events are then taken
as input to implement user-defined actions on application objects (e.g., push that button or select that geometry on the
screen and move it close to me).

It is a traslation from the [Java Bias package](https://github.com/nakednous/bias) to Java Script. It follows the ECMAScript 2016 standard. 

# TODO

- Implement registerMethod('mouseEvent') in p5.js.
- Implement registerMethod('keyEvent') in p5.js .
- Find a way to test DOF6 class.


# Code Style Guide

- Private variables starts with an underscore "_" (e.g., `_variable_name`).
- We recommend airbnb's Javascript Style [Guide](https://github.com/airbnb/javascrip)]

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
npm run-script build # compiles bias in a single file availabe on /build/bias/.js
npm doc # generates the documentation on /doc folder
```

this project uses ES6 features, you can see an updated list of features
implemented in diferent transpilers or browsers [here](https://kangax.github.io/compat-table/es6/)

# Acknowledgements

- [Jairo Suárez](https://github.com/xyos) for the js port.
- [Alejandro Giraldo](https://github.com/lagiraldol).

# Author, core developer and maintainer

[Jean Pierre Charalambos](http://disi.unal.edu.co/profesores/pierre/), [National University of Colombia](http://www.unal.edu.co)
