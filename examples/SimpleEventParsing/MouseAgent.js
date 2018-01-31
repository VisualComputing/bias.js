class MouseAgent extends bias.Agent {
  constructor(handler) {
    super(handler);
    this.click2Pick = false;
    this.currentEvent = null;
    this.prevEvent = null;
    this.move = false;
    this.press = false;
    this.drag = false;
    this.release = false;
    this.click = false;
    this.prevType = null;
  }

  mouseEvent(e) {
    // MoseEvent.which is non-stantard, it will not work for every user. MouseEvent.buttons is used instead.
    this.move = e.type === "mousemove" && e.buttons === 0;
    this.press = e.type === "mousedown";
    this.drag = e.type === "mousemove" && e.buttons > 0;
    this.release = e.type === "mouseup";
    //emulate click with middle and right button
    this.click = false;
    if(this.prevEvent !== null){
      if((this.prevType === "mousedown" && e.type === "mouseup") || e.type === "click"){
        this.click = true;
      }
    }
    this.prevType = e.type;

    // Modifiers
    const SHIFT = e.shiftKey ? bias.Event.SHIFT : 0b0;
    const CTRL = e.ctrlKey   ? bias.Event.CTRL  : 0b0;
    const META = e.metaKey   ? bias.Event.META  : 0b0;
    const ALT  = e.altKey    ? bias.Event.ALT   : 0b0;
    const modifiers = SHIFT + CTRL + META + ALT > 0 ? SHIFT + CTRL + META + ALT : bias.NO_MODIFIER_MASK;

    if (!this.click && (this.move || this.press || this.drag || this.release)) {
      this.currentEvent = new bias.event.MotionEvent2({
        previous: this.prevEvent,
        x: mouseX,
        y: mouseY,
        modifiers,
        id: this.move ? bias.NO_ID : e.which,
      });
      if (this.move) {
        this.poll(this.currentEvent);
      }
      this.handle(this.press ? this.currentEvent.fire() : this.release ? this.currentEvent.flush() : this.currentEvent);
      this.prevEvent = this.currentEvent.get();
      return;
    }
    if (e.type === "wheel") {
      const delta = e.wheelDelta !== 0 ? e.wheelDelta > 0 ? 1 : -1 : 0;
      this.handle(new bias.event.MotionEvent1({ dx: delta, modifiers, id: MouseAgent.WHEEL }));
      return;
    }
    if (this.click) {
      const bogusTapEvent = new bias.event.TapEvent({
        x: mouseX,
        y: mouseY,
        modifiers,
        id: e.which,
        count: e.detail,
      });
      this.handle(bogusTapEvent);
      return;
    }
  }
}
//static fields
/* NO_BUTTON, LEFT and RIGHT events are assigned according to
 * https://developer.mozilla.org/es/docs/Web/API/MouseEvent/buttons */
MouseAgent.NO_BUTTON = bias.Event.NO_ID;
MouseAgent.LEFT      = 1;
MouseAgent.MIDDLE    = 2;
MouseAgent.RIGHT     = 3;
MouseAgent.WHEEL     = 10;
