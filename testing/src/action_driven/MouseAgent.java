package action_driven;

import remixlab.bias.*;
import remixlab.bias.event.*;

/**
 * Created by pierre on 12/22/16.
 */
public class MouseAgent extends Agent {
  public boolean click2Pick;
  protected DOF2Event  currentEvent, prevEvent;
  protected boolean    move, press, drag, release;

  public MouseAgent(InputHandler handler) {
    super(handler);
  }

  public void mouseEvent(processing.event.MouseEvent e) {
    move = e.getAction() == processing.event.MouseEvent.MOVE;
    press = e.getAction() == processing.event.MouseEvent.PRESS;
    drag = e.getAction() == processing.event.MouseEvent.DRAG;
    release = e.getAction() == processing.event.MouseEvent.RELEASE;
    //better and more robust is to work without modifiers, which Processing don't report reliably
    if (move || press || drag || release) {
      currentEvent = new DOF2Event(prevEvent, e.getX(), e.getY(),
          Event.NO_MODIFIER_MASK, move ? Event.NO_ID : e.getButton());
      if (move && !click2Pick)
        updateTrackedGrabber(currentEvent);
      handle(press ? currentEvent.fire() : release ? currentEvent.flush() : currentEvent);
      prevEvent = currentEvent.get();
      return;
    }
    if (e.getAction() == processing.event.MouseEvent.WHEEL) {// e.getAction() = MouseEvent.WHEEL = 8
      handle(new DOF1Event(e.getCount(), Event.NO_MODIFIER_MASK, ActionDrivenCallback.WHEEL_ID));
      return;
    }
    if (e.getAction() == processing.event.MouseEvent.CLICK) {
      ClickEvent bogusClickEvent = new ClickEvent(e.getX(), e.getY(),
          Event.NO_MODIFIER_MASK, e.getButton(), e.getCount());
      if (click2Pick)
        updateTrackedGrabber(bogusClickEvent);
      handle(bogusClickEvent);
      return;
    }
  }
}
