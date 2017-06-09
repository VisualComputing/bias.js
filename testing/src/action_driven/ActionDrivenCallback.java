package action_driven;

import remixlab.bias.*;
import remixlab.bias.event.*;
import processing.core.*;

/**
 * Created by pierre on 12/22/16.
 */
public class ActionDrivenCallback extends PApplet {
  MouseAgent agent;
  InputHandler inputHandler;
  Ellipse [] ellipses;

  //Choose one of P3D for a 3D scene, or P2D or JAVA2D for a 2D scene
  String renderer = P2D;

  public void settings() {
    size(800, 800, renderer);
  }

  public void setup() {
    inputHandler = new InputHandler();
    agent = new MouseAgent(inputHandler);
    registerMethod("mouseEvent", agent);
    ellipses = new Ellipse[50];
    for (int i = 0; i < ellipses.length; i++)
      ellipses[i] = new Ellipse(this, inputHandler);
  }

  public void draw() {
    background(255);
    for (int i = 0; i < ellipses.length; i++) {
      if ( ellipses[i].grabsInput(agent) )
        ellipses[i].draw(color(255, 0, 0));
      else
        ellipses[i].draw();
    }
    inputHandler.handle();
  }

  public void keyPressed() {
    if (key == ' ') {
      agent.click2Pick = !agent.click2Pick;
      agent.resetTrackedGrabber();
      for (int i = 0; i < ellipses.length; i++)
        if (agent.click2Pick)
          ellipses[i].setMouseMoveBindings();
        else
          ellipses[i].setMouseDragBindings();
    }
  }

  public static void main(String args[]) {
    PApplet.main(new String[]{"action_driven.ActionDrivenCallback"});
  }
}
