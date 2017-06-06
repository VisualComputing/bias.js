class Ellipse extends bias.GrabberObject {
  constructor(agent, center = null, radius = 0) {
    super();
    if (radius === 0 && center === null) {
      this.setPosition();
      this.contourColor = color(0, 0, 0);
    } else {
      this.radiusX = radius;
      this.radiusY = radius;
      this.center = center;
    }
    this.setColor();
    this.sWeight = 4;
    agent.addGrabber(this);
  }

  setColor(myC = null) {
    if (myC === null) {
      setColor(
        color(random(0, 255), random(0, 255), random(0, 255), random(100, 200))
      );
    }
    this.colour = myC;
  }

  setPosition(x, y) {
    this.setPositionAndRadii(createVector(x, y), radiusX, radiusY);
  }

  setPositionAndRadii(p, rx, ry) {
    this.center = p;
    this.radiusX = rx;
    this.radiusY = ry;
  }

  setPosition() {
    let maxRadius = 50;
    let low = maxRadius;
    let highX = 800 - maxRadius;
    let highY = 800 - maxRadius;
    let r = random(20, maxRadius);
    setPositionAndRadii(
      new PVector(random(low, highX), random(low, highY)),
      r,
      r
    );
  }

  draw() {
    draw(colour);
  }

  draw(c = this.colour) {
    pushStyle();
    stroke(contourColour);
    strokeWeight(sWeight);
    fill(c);
    ellipse(center.x, center.y, 2 * radiusX, 2 * radiusY);
    popStyle();
  }

  checkIfGrabsInputDOF2(event) {
    return checkIfGrabsInput(event.x(), event.y());
  }

  checkIfGrabsInputClick(event) {
    return checkIfGrabsInput(event.x(), event.y());
  }

  checkIfGrabsInput(x, y) {
    return (
      pow(x - center.x, 2) / pow(radiusX, 2) +
        pow(y - center.y, 2) / pow(radiusY, 2) <=
      1
    );
  }

  performInteractionClick(event) {
    if (event.id() == LEFT) setColor();
    else if (event.id() == RIGHT) {
      if (sWeight > 1) sWeight--;
    } else sWeight++;
  }

  performInteractionDOF2(event) {
    if (event.id() == LEFT) setPosition();
    else if (event.id() == RIGHT) {
      radiusX += event.dx();
      radiusY += event.dy();
    }
  }
}

let inputHandler;

function setup() {
  (800, 800);
  inputHandler = new bias.InputHandler();
  // agent = new MouseAgent(inputHandler);
  // registerMethod("mouseEvent", agent);
}

function draw() {
  background(255);
  inputHandler.handle();
}
