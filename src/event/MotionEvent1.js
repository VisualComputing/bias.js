import MotionEvent from './MotionEvent';

/**
 * A {@link remixlab.bias.event.MotionEvent} with one degree of freedom ( {@link #x()}).
 */
export default class DOF1Event extends MotionEvent {
  /**
   * Construct an absolute DOF1 event.
   *
   * @param dx        1-dof
   * @param x         1-dof
   * @param prevEvent
   * @param modifiers MotionShortcut modifiers
   * @param id        MotionShortcut gesture-id
   */
  constructor({ x = 0, dx = 0, modifiers = null, id = null, prevEvent = null, other = null }) {
    if (other) {
      super({ other });
      this._x = other.x;
      this._dx = other.dx;
    } else if (prevEvent !== null) {
      super({ modifiers, id });
      this.setPreviousEvent(prevEvent);
      this._x = x;
      this._dx = x;
    } else if (dx !== null && modifiers !== null && id !== null) {
      super({ modifiers, id });
      this._x = x;
      this.dx = dx;
    } else {
      super();
      this._x = x;
      this.dx = dx;
    }
  }

  get() {
    return new DOF1Event(this);
  }

  flush() {
    super.flush();
  }

  fire() {
    super.fire();
  }

  setPreviousEvent(prevEvent) {
    this._rel = true;
    if (prevEvent != null) {
      if (prevEvent instanceof DOF1Event && prevEvent.id() === this.id()) {
        this._dx = this.x() - prevEvent.x();
        this._distance = this.x() - prevEvent.x();
        this._delay = this.timestamp() - prevEvent.timestamp();
        if (this._delay === 0) this._speed = this._distance;
        else this._speed = this._distance / this._delay;
      }
    }
  }

  /**
   * @return dof-1, only meaningful if the event {@link #isRelative()}
   */
  x() {
    return this._x;
  }

  /**
   * @return dof-1 delta
   */
  dx() {
    return this._dx;
  }

  /**
   * @return previous dof-1, only meaningful if the event {@link #isRelative()}
   */
  prevX() {
    return this._x() - this._dx();
  }

  modulate(sens = null) {
    if (sens != null) {
      if (sens.length >= 1 && this.isAbsolute()) {
        this._dx *= sens[0];
      }
    }
  }

  isNull() {
    if (this.dx() === 0) return true;
    return false;
  }
}
