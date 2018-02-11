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

  setShape(event, dof1 = true) {
      this.radiusX += event.dx();
      this.radiusY += dof1 ? event.dx() : event.dy();
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
    } else {
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
      this.setShape(event, false);
    }
  }
}