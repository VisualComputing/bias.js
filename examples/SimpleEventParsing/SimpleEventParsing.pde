/**
 * Simple Event Parsing
 * by Jean Pierre Charalambos
 *
 * Event parsing is based on the event.id()
 */

import remixlab.bias.*;
import remixlab.bias.event.*;

MouseAgent agent;
InputHandler inputHandler;
Ellipse [] ellipses;

void setup() {
  size(800, 800, P2D);
  inputHandler = new InputHandler();
  agent = new MouseAgent(inputHandler);
  registerMethod("mouseEvent", agent);
  ellipses = new Ellipse[50];
  for (int i = 0; i < ellipses.length; i++)
    ellipses[i] = new Ellipse(agent);
}

void draw() {
  background(255);
  for (int i = 0; i < ellipses.length; i++) {
    if ( ellipses[i].grabsInput(agent) )
      ellipses[i].draw(color(255, 0, 0));
    else
      ellipses[i].draw();
  }
  inputHandler.handle();
}