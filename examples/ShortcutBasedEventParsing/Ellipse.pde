public class Ellipse extends GrabberObject {
  public float radiusX, radiusY;
  public PVector center;
  public color colour;
  public int contourColour;
  public int sWeight;
  public boolean move;

  public Ellipse(InputHandler handler) {
    super(handler);
    setMouseDragBindings();
    setColor();
    setPosition();
    sWeight = 4;
    contourColour = color(0, 0, 0);
  }

  public Ellipse(InputHandler handler, PVector c, float r) {
    super(handler);
    setMouseDragBindings();
    radiusX = r;
    radiusY = r;
    center = c;
    setColor();
    sWeight = 4;
  }

  public void setColor(color myC) {
    colour = myC;
  }

  public void setColor() {
    setColor(color(random(0, 255), random(0, 255), random(0, 255), random(100, 200)));
  }

  public void setPosition(DOF2Event event) {
    setPositionAndRadii(new PVector(event.x(), event.y()), radiusX, radiusY);
  }
  
  public void setShape(DOF1Event event) {
    radiusX += event.dx();
    radiusY += event.dx();
  }

  public void setShape(DOF2Event event) {
    radiusX += event.dx();
    radiusY += event.dy();
  }

  public void setPositionAndRadii(PVector p, float rx, float ry) {
    center = p;
    radiusX = rx;
    radiusY = ry;
  }

  public void setPosition() {
    float maxRadius = 50;
    float low = maxRadius;
    float highX = 800 - maxRadius;
    float highY = 800 - maxRadius;
    float r = random(20, maxRadius);
    setPositionAndRadii(new PVector(random(low, highX), random(low, highY)), r, r);
  }

  public void draw() {
    draw(colour);
  }

  public void draw(int c) {
    pushStyle();
    stroke(contourColour);
    strokeWeight(sWeight);
    fill(c);
    ellipse(center.x, center.y, 2*radiusX, 2*radiusY);
    popStyle();
  }

  public void setMouseDragBindings() {
    move = false;
  }

  public void setMouseMoveBindings() {
    move = true;
  }

  @Override
  public void performInteraction(DOF2Event event) { 
    if (move) {
      if (event.shortcut().matches(new Shortcut(remixlab.bias.Event.NO_ID)))
        setPosition(event);
    } else {
      if (event.shortcut().matches(new Shortcut(LEFT)))
        setPosition(event);
    }
    if (event.shortcut().matches(new Shortcut(RIGHT)))
      setShape(event);
  }
  
  @Override
  public void performInteraction(DOF1Event event) {
    if (event.shortcut().matches(new Shortcut(remixlab.bias.Event.CTRL, processing.event.MouseEvent.WHEEL)))
      setShape(event);
  }

  @Override
  public void performInteraction(ClickEvent event) {
    if (event.shortcut().matches(new ClickShortcut(LEFT, 1)))
      setColor();
  }

  @Override
  public boolean checkIfGrabsInput(DOF2Event event) {
    return checkIfGrabsInput(event.x(), event.y());
  }

  @Override
  public boolean checkIfGrabsInput(ClickEvent event) {
    return checkIfGrabsInput(event.x(), event.y());
  }

  public boolean checkIfGrabsInput(float x, float y) {
    return(pow((x - center.x), 2)/pow(radiusX, 2) + pow((y - center.y), 2)/pow(radiusY, 2) <= 1);
  }
}