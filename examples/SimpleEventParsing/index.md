---
title: Simple Event Parsing
permalink: simpleevent.html
layout: default



---

# Simple Event Parsing Example:

<div id="SimpleEvent">
<!-- SimpleEventParsing sketch will go here! -->  

<script>
  function load(){
    document.body.addEventListener("wheel", zoomShortcut); //add the event
    document.oncontextmenu = function() {
      return false;
    }
  }

  function zoomShortcut(e) {
    if (e.ctrlKey) {            //[ctrl] pressed?
      event.preventDefault();  //prevent zoom
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
  }

  setColor(myC = null) {
    if(myC !== null)
      this.colour = myC;
    else
      this.colour = color(random(0, 255), random(0, 255), random(0, 255), random(100, 200));
  }

  setPosition(x = null, y = null) {
    if (x === null && y === null) {
      const maxRadius = 50;
      const low = maxRadius;
      const highX = width - maxRadius;
      const highY = height - maxRadius;
      const r = random(20, maxRadius);
      this.setPositionAndRadii(new p5.Vector(random(low, highX), random(low, highY)), r, r);
    } else {
      this.setPositionAndRadii(new p5.Vector(x, y), this.radiusX, this.radiusY);
    }
  }

  setPositionAndRadii(p, rx, ry) {
    this.center = p;
    this.radiusX = rx;
    this.radiusY = ry;
  }

  draw(c = this.colour) {
    push();
    stroke(this.contourColour);
    strokeWeight(this.sWeight);
    fill(c);
    ellipse(this.center.x, this.center.y, 2*this.radiusX, 2*this.radiusY);
    pop();
  }

  track(event) {
    //we're sure it must be a Tap or a MotionEvent
    const x = event.x();
    const y = event.y()
    return (pow((x - this.center.x), 2)/pow(this.radiusX, 2) + pow((y - this.center.y), 2)/pow(this.radiusY, 2) <= 1);
  }

  interact(event) {
    if ( event instanceof bias.event.TapEvent ) {
      if ( event.id() === MouseAgent.LEFT) {
        this.setColor();
      } else if (event.id() === MouseAgent.RIGHT) {
        if (this.sWeight > 1)
          this.sWeight--;
      } else
          this.sWeight++;
    } else if (event instanceof bias.event.MotionEvent2) {
      if (event.id() == MouseAgent.LEFT)
        this.setPosition(event.x(), event.y());
      else if ( event.id() == MouseAgent.RIGHT ) {
        this.radiusX += event.dx();
        this.radiusY += event.dy();
      }
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
    this.click = false;
    this.prevType = null;
  }

  mouseEvent(e) {
    this.move = e.type === "mousemove" && e.which === 0;
    this.press = e.type === "mousedown";
    this.drag = e.type === "mousemove" && e.which > 0;
    this.release = e.type === "mouseup";
    //emulate click with middle and right button
    this.click = false;
    if(this.prevEvent !== null){
      if((this.prevType === "mousedown" && e.type === "mouseup") || e.type === "click"){
        this.click = true;
      }
    }
    this.prevType = e.type;

    // Modifiers
    const SHIFT = e.shiftKey ? bias.Event.SHIFT : 0b0;
    const CTRL = e.ctrlKey   ? bias.Event.CTRL  : 0b0;
    const META = e.metaKey   ? bias.Event.META  : 0b0;
    const ALT  = e.altKey    ? bias.Event.ALT   : 0b0;
    const modifiers = SHIFT + CTRL + META + ALT > 0 ? SHIFT + CTRL + META + ALT : bias.NO_MODIFIER_MASK;

    if (!this.click && (this.move || this.press || this.drag || this.release)) {
      this.currentEvent = new bias.event.MotionEvent2({
        previous: this.prevEvent,
        x: mouseX,
        y: mouseY,
        modifiers,
        id: this.move ? bias.NO_ID : e.which,
      });
      if (this.move) {
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
    if (this.click) {
      const bogusTapEvent = new bias.event.TapEvent({
        x: mouseX,
        y: mouseY,
        modifiers,
        id: e.which,
        count: e.detail,
      });
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

```

### Simple Event Parsing:

```js

let agent;
let inputHandler;
let ellipses = [];

function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  canvas.parent('SimpleEvent');
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
  for (let i = 0; i < 100; i++){
    const ellipse = new Ellipse();
    ellipses.push(ellipse);
    //Associate the Ellipse with the Agent
    agent.addGrabber(ellipse);
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
  if(!MouseAgent.STOP){
    inputHandler.handle();
  }
}

```


<!-- Javascript Code -->
<!-- Adjust sketch size to 600x338px  -->

<script src="./js/bias.js"></script>
<script src="./js/p5.js"></script>

<script src="./examples/SimpleEventParsing/Ellipse.js"></script>
<script
 src="./examples/SimpleEventParsing/MouseAgent.js"></script>

<body onload="load()">
    <script src="./examples/SimpleEventParsing/SimpleEventParsing.js"></script>
</body>
