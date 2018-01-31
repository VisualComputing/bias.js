---
title: ShortcutBasedEventParsing
permalink: shortcut.html
layout: default



---

## Shortcut-based Event Parsing Example:


<div id="Shortcut">
<!-- Shortcut sketch will go here! -->  

<script>
  function load(){
    document.body.addEventListener("wheel", zoomShortcut); //add the event
    document.oncontextmenu = function() {
      return false;
    }
  }

  function zoomShortcut(e) {
    if (e.ctrlKey == true) {            //[ctrl] pressed?
      e.preventDefault();  //prevent zoom
      return false; 
    }
  }
</script>
</div>

## Source Code:

### Ellipse:

```js
class Ellipse {

  constructor(center = null, radius = null) {

    if ((radius === null && center === null)) {
      this.radiusX, this.radiusY, this.center;
      this.setPosition();

    } else {
      this.radiusX = radius;
      this.radiusY = radius;
      this.center = center;
    }
    this.colour;
    this.contourColour = color(0, 0, 0);
    this.move = false;
    this.sWeight = 4;
    this.setColor();
    this.setMouseDragBindings();
  }

  setColor(myC = null) {
    if(myC !== null)
      this.colour = myC;
    else
      this.colour = color(random(0, 255), random(0, 255), random(0, 255), random(100, 200));
  }

  setPosition(event = null) {
    if(event === null){
      const maxRadius = 50;
      const low = maxRadius;
      const highX = width - maxRadius;
      const highY = height - maxRadius;
      const r = random(20, maxRadius);
      this.setPositionAndRadii(new p5.Vector(random(low, highX), random(low, highY)), r, r);
    }else {
      this.setPositionAndRadii(new p5.Vector(event.x(), event.y()), this.radiusX, this.radiusY);
    }
  }

  setShape(event) {
    if ( event instanceof bias.event.MotionEvent1 ) {
      this.radiusX += event.dx();
      this.radiusY += event.dx();
    } else if ( event instanceof bias.event.MotionEvent2 ) {
      this.radiusX += event.dx();
      this.radiusY += event.dy();
    }
  }

  setPositionAndRadii(p, rx, ry) {
    this.center = p;
    this.radiusX = floor(rx);
    this.radiusY = floor(ry);
  }


  draw(c = this.colour) {
    push();
    stroke(this.contourColour);
    strokeWeight(this.sWeight);
    fill(c);
    ellipse(this.center.x, this.center.y, 2*this.radiusX, 2*this.radiusY);
    pop();
  }

  setMouseDragBindings() {
    this.move = false;
  }

  setMouseMoveBindings() {
    this.move = true;
  }

  interact(event) {
    if (event.shortcut().matches(new bias.Shortcut({ id: MouseAgent.WHEEL, modifiers: bias.Event.CTRL }))) {
      this.setShape(event);
    } else if (event.shortcut().matches(new bias.event.TapShortcut({ id: MouseAgent.CLICK, count: 1 }))) {
      this.setColor();
    } else if (event instanceof bias.event.MotionEvent2) {
      this.motion2Interaction(event);
    }
  }

  track(event) {
    //we're sure it must be a Tap or a MotionEvent
    const x = event.x();
    const y = event.y()
    return (pow((x - this.center.x), 2)/pow(this.radiusX, 2) + pow((y - this.center.y), 2)/pow(this.radiusY, 2) <= 1);
  }

  motion2Interaction(event) {
    if (this.move) {
      if (event.shortcut().matches(new bias.Shortcut({ id: MouseAgent.NO_BUTTON }))) {
        this.setPosition(event);
      }
    } else {
      if (event.shortcut().matches(new bias.Shortcut({ id: MouseAgent.LEFT })))
        this.setPosition(event);
    }
    if (event.shortcut().matches(new bias.Shortcut({ id: MouseAgent.RIGHT }))) {
      this.setShape(event);
    }
  }
}

```

### Mouse Agent:

```js

class MouseAgent extends bias.Agent {
  constructor(handler) {
    super(handler);
    this.click2Pick = false;
    this.currentEvent = null;
    this.prevEvent = null;
    this.move = false;
    this.press = false;
    this.drag = false;
    this.release = false;
  }

  mouseEvent(e) {
    this.move = e.type === "mousemove" && e.which === 0;
    this.press = e.type === "mousedown";
    this.drag = e.type === "mousemove" && e.which > 0;
    this.release = e.type === "mouseup";

    // Modifiers
    const SHIFT = e.shiftKey ? bias.Event.SHIFT : 0b0;
    const CTRL = e.ctrlKey   ? bias.Event.CTRL  : 0b0;
    const META = e.metaKey   ? bias.Event.META  : 0b0;
    const ALT  = e.altKey    ? bias.Event.ALT   : 0b0;
    const modifiers = SHIFT + CTRL + META + ALT > 0 ? SHIFT + CTRL + META + ALT : bias.NO_MODIFIER_MASK;

    if (this.move || this.press || this.drag || this.release) {
      this.currentEvent = new bias.event.MotionEvent2({
        previous: this.prevEvent,
        x: mouseX,
        y: mouseY,
        modifiers,
        id: this.move ? bias.NO_ID : e.which,
      });
      if (this.move && !this.click2Pick) {
        this.poll(this.currentEvent);
      }
      this.handle(this.press ? this.currentEvent.fire() : this.release ? this.currentEvent.flush() : this.currentEvent);
      this.prevEvent = this.currentEvent.get();
      return;
    }
    if (e.type === "wheel") {
      const delta = e.wheelDelta !== 0 ? e.wheelDelta > 0 ? 1 : -1 : 0;
      this.handle(new bias.event.MotionEvent1({ dx: delta, modifiers, id: MouseAgent.WHEEL }));
      return;
    }
    if (e.type == "click") {
      const bogusTapEvent = new bias.event.TapEvent({
        x: mouseX,
        y: mouseY,
        modifiers,
        id: MouseAgent.CLICK,
        count: e.detail,
      });
      if (this.click2Pick)
        this.poll(bogusTapEvent);
      this.handle(bogusTapEvent);
      return;
    }
  }
}
//static fields
/* NO_BUTTON, LEFT and RIGHT events are assigned according to
 * https://developer.mozilla.org/es/docs/Web/API/MouseEvent/buttons */
MouseAgent.NO_BUTTON = bias.Event.NO_ID;
MouseAgent.LEFT      = 1;
MouseAgent.MIDDLE    = 2;
MouseAgent.RIGHT     = 3;
MouseAgent.WHEEL     = 10;
MouseAgent.CLICK     = 11;

```


### ShortcutBasedEventParsing:

```js
/**
 * Shortcut-based Event Parsing
 * by Jean Pierre Charalambos
 *
 * Event parsing is based on the event.shortcut()
 */

let agent;
let inputHandler;
let ellipses = [];
let canvas;

function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight);+
  canvas.parent('Shortcut');
  inputHandler = new bias.InputHandler();
  agent = new MouseAgent(inputHandler);
  //Register methods
  canvas.mouseMoved( function(event){
    agent.mouseEvent(event);
  });
  canvas.mouseClicked( function(event){
    agent.mouseEvent(event);
  });
  canvas.mousePressed( function(event){
    agent.mouseEvent(event);
  });
  canvas.mouseReleased( function(event){
    agent.mouseEvent(event);
  });
  canvas.mouseWheel( function(event){
    agent.mouseEvent(event);
  });

  for (let i = 0; i < 100; i++) {
    const ellipse = new Ellipse();
    ellipses.push(ellipse);
    //Associate the Ellipse with the InputHandler
    inputHandler.addGrabber(ellipse);
  }
}

function draw() {
  background(255);
  for (let i = 0; i < ellipses.length; i++) {
    if ( agent.inputGrabber() === ellipses[i] )
      ellipses[i].draw(color(255, 0, 0));
    else
      ellipses[i].draw();
  }
  inputHandler.handle();
}

function keyPressed(){
  if (key == ' ') {
    agent.click2Pick = !agent.click2Pick;
    agent.resetTrackedGrabber();
    for (let i = 0; i < ellipses.length; i++)
    if (agent.click2Pick)
      ellipses[i].setMouseMoveBindings();
    else
      ellipses[i].setMouseDragBindings();
  }
}

```


<!-- Javascript Code -->
<!-- Adjust sketch size to 600x338px  -->

<script src="./js/bias.js"></script>
<script src="./js/p5.js"></script>

<script src="./examples/ShortcutBasedEventParsing/Ellipse.js"></script>
<script
 src="./examples/ShortcutBasedEventParsing/MouseAgent.js"></script>


<script src="./examples/ShortcutBasedEventParsing/ShortcutBasedEventParsing.js"></script>
