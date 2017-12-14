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
  }

  mouseEvent(e) {
    this.move = e.type === "mousemove";
    this.press = e.type === "mousedown";
    this.drag = this.move && e.buttons > 0;
    this.release = e.type === "mouseup";

    // modifiers
    const SHIFT = e.shiftKey ? 0b1    : 0b0;
    const CTRL = e.ctrlKey   ? 0b10   : 0b0;
    const META = e.metaKey   ? 0b100  : 0b0;
    const ALT  = e.altKey    ? 0b1000 : 0b0;
    const modifiers = SHIFT + CTRL + META + ALT > 0 ? SHIFT + CTRL + META + ALT : bias.NO_MODIFIER_MASK;

    if (this.move || this.press || this.drag || this.release) {
      this.currentEvent = new bias.event.MotionEvent2({
        previous: this.prevEvent,
        x: e.clientX,
        y: e.clientY,
        modifiers,
        id: this.move ? bias.NO_ID : e.buttons,
      });
      if (this.move && !this.click2Pick) {
        this.poll(this.currentEvent);
      }
      this.handle(this.press ? this.currentEvent.fire() : this.release ? this.currentEvent.flush() : this.currentEvent);
      this.prevEvent = this.currentEvent.get();
      return;
    }
    if (e.type === "wheel") {
      const delta = e.wheelDelta !== 0 ? e.wheelDelta > 0 ? 1 : -1 : 0;
      this.handle(new bias.event.MotionEvent1({ dx: delta, modifiers, id: 10 }));
      return;
    }
    if (e.type == "click") {
      const bogusTapEvent = new bias.event.TapEvent({
        x: e.clientX,
        y: e.clientY,
        modifiers,
        id: 11,
        count: e.detail,
      });
      if (this.click2Pick)
        this.poll(bogusTapEvent);
      this.handle(bogusTapEvent);
      return;
    }
  }
}