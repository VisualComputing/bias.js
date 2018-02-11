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
    if (event.shortcut().matches(new bias.event.TapShortcut({ id: MouseAgent.LEFT}))) {
      this.setColor();
    } else if (event.shortcut().matches(new bias.event.TapShortcut({ id: MouseAgent.RIGHT}))) {
      if (this.sWeight > 1)
        this.sWeight--;
    } else if (event.shortcut().matches(new bias.event.TapShortcut({ id: MouseAgent.MIDDLE}))) {
      this.sWeight++;
    } else if (event.shortcut().matches(new bias.Shortcut({ id: MouseAgent.LEFT }))) {
      this.setPosition(event.x(), event.y());
    } else if (event.shortcut().matches(new bias.Shortcut({ id: MouseAgent.RIGHT }))) {
      this.radiusX += event.dx();
      this.radiusY += event.dy();
    }
  }
}
