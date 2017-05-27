package simple;

import remixlab.bias.*;
import remixlab.bias.event.*;
import processing.core.*;

/**
 * Created by pierre on 12/22/16.
 */
public class Ellipse extends GrabberObject {
  public PApplet parent;
  public float radiusX, radiusY;
  public PVector center;
  public int colour;
  public int contourColour;
  public int sWeight;

  public Ellipse(PApplet p, Agent agent) {
    parent = p;
    agent.addGrabber(this);
    setColor();
    setPosition();
    sWeight = 4;
    contourColour = parent.color(0, 0, 0);
  }

  public Ellipse(PApplet p, Agent agent, PVector c, float r) {
    parent = p;
    agent.addGrabber(this);
    radiusX = r;
    radiusY = r;
    center = c;
    setColor();
    sWeight = 4;
  }

  public void setColor() {
    setColor(parent.color(parent.random(0, 255), parent.random(0, 255), parent.random(0, 255), parent.random(100, 200)));
  }

  public void setColor(int myC) {
    colour = myC;
  }

  public void setPosition(float x, float y) {
    setPositionAndRadii(new PVector(x, y), radiusX, radiusY);
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
    float r = parent.random(20, maxRadius);
    setPositionAndRadii(new PVector(parent.random(low, highX), parent.random(low, highY)), r, r);
  }

  public void draw() {
    draw(colour);
  }

  public void draw(int c) {
    parent.pushStyle();
    parent.stroke(contourColour);
    parent.strokeWeight(sWeight);
    parent.fill(c);
    parent.ellipse(center.x, center.y, 2*radiusX, 2*radiusY);
    parent.popStyle();
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
    return(parent.pow((x - center.x), 2)/parent.pow(radiusX, 2) + parent.pow((y - center.y), 2)/parent.pow(radiusY, 2) <= 1);
  }

  @Override
  public void performInteraction(ClickEvent event) {
    if ( event.id() == PApplet.LEFT )
      setColor();
    else if ( event.id() == PApplet.RIGHT ) {
      if (sWeight > 1)
        sWeight--;
    } else
      sWeight++;
  }

  @Override
  public void performInteraction(DOF2Event event) {
    if ( event.id() == PApplet.LEFT )
      setPosition();
    else if ( event.id() == PApplet.RIGHT ) {
      radiusX += event.dx();
      radiusY += event.dy();
    }
  }
}
