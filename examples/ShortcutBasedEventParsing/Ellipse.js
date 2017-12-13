class Ellipse extends bias.GrabberObject {

  constructor(handler, center = null, radius = null) {
    super(handler);
    if ((radius === null && center === null)){
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
      const highX = 800 - maxRadius;
      const highY = 800 - maxRadius;
      const r = random(20, maxRadius);
      this.setPositionAndRadii(new p5.Vector(random(low, highX), random(low, highY)), r, r);
    }else {
      this.setPositionAndRadii(new p5.Vector(event.x(), event.y()), radiusX, radiusY);
    }
  }

  setShape(event) {
    if ( event instanceof MotionEvent1 ) {
      this.radiusX += event.dx();
      this.radiusY += event.dx();
    } else if ( event instanceof MotionEvent2 ) {
      this.radiusX += event.dx();
      this.radiusY += event.dy();
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

  setMouseDragBindings() {
    this.move = false;
  }

  setMouseMoveBindings() {
    this.move = true;
  }

  motion2Interaction(event) {
    if (this.move) {
      if (event.shortcut().matches(new bias.Shortcut(bias.Event.NO_ID)))
        this.setPosition(event);
    } else {
      if (event.shortcut().matches(new bias.Shortcut(LEFT)))
        this.setPosition(event);
    }
    if (event.shortcut().matches(new bias.Shortcut(RIGHT)))
      this.setShape(event);
  }

  motion1Interaction(event) {
    if (event.shortcut().matches(new bias.Shortcut(bias.Event.CTRL, CENTER)))
      this.setShape(event);
  }

  tapInteraction(event) {
    if (event.shortcut().matches(new TapShortcut(LEFT, 1)))
      this.setColor();
  }

  motion2Tracking(event) {
    return this.track(event.x(), event.y());
  }

  tapTracking(event) {
    return this.track(event.x(), event.y());
  }

  track(x, y) {
    return (pow((x - this.center.x), 2)/pow(this.radiusX, 2) + pow((y - this.center.y), 2)/pow(this.radiusY, 2) <= 1);
  }
}