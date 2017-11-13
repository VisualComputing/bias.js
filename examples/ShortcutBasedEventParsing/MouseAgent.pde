public class MouseAgent extends Agent {
  public boolean click2Pick;
  protected MotionEvent2  currentEvent, prevEvent;
  protected boolean    move, press, drag, release;

  public MouseAgent(InputHandler handler) {
    super(handler);
  }
  
  public void mouseEvent(processing.event.MouseEvent e) {
    move = e.getAction() == processing.event.MouseEvent.MOVE;
    press = e.getAction() == processing.event.MouseEvent.PRESS;
    drag = e.getAction() == processing.event.MouseEvent.DRAG;
    release = e.getAction() == processing.event.MouseEvent.RELEASE;
    if (move || press || drag || release) {
      currentEvent = new MotionEvent2(prevEvent, e.getX(), e.getY(),
          e.getModifiers(), move ? remixlab.input.Event.NO_ID : e.getButton());
      if (move && !click2Pick)
        poll(currentEvent);
      handle(press ? currentEvent.fire() : release ? currentEvent.flush() : currentEvent);
      prevEvent = currentEvent.get();
      return;
    }
    if (e.getAction() == processing.event.MouseEvent.WHEEL) {
      handle(new MotionEvent1(e.getCount(), e.getModifiers(), processing.event.MouseEvent.WHEEL));
      return;
    }
    if (e.getAction() == processing.event.MouseEvent.CLICK) {
      TapEvent bogusTapEvent = new TapEvent(e.getX(), e.getY(),
          e.getModifiers(), e.getButton(), e.getCount());
      if (click2Pick)
        poll(bogusTapEvent);
      handle(bogusTapEvent);
      return;
    }
  }
}
