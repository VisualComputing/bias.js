import MotionEvent from './MotionEvent';
import DOF1Event from './DOF1Event';

/**
 * A {@link remixlab.bias.event.MotionEvent} with two degrees-of-freedom ( {@link #x()}
 * and {@link #y()}).
 */
export default class DOF2Event extends MotionEvent {
  /**
   * Construct an absolute event from the given dof's and modifiers.
   *
   * @param dx
   * @param dy
   * @param modifiers
   * @param id
   */
  constructor({
    x = 0,
    y = 0,
    dx = 0,
    dy = 0,
    modifiers = null,
    id = null,
    prevEvent = null,
    other = null }) {
    if (other) {
      super({ other });
      this._x = other.x;
      this._dx = other.dx;
    } else if (prevEvent !== null) {
      super({ modifiers, id });
      this.setPreviousEvent(prevEvent);
      this._x = x;
      this._y = y;
      this._dx = dx;
      this._dy = dy;
    } else if (dx !== null && dy !== null && modifiers !== null && id !== null) {
      super({ modifiers, id });
      this._x = x;
      this._y = y;
      this._dx = dx;
      this._dy = dy;
    } else {
      super();
      this._x = x;
      this._y = y;
      this._dx = dx;
      this._dy = dy;
    }
  }

  get() {
    return new DOF2Event(this);
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
      if (prevEvent instanceof DOF2Event && prevEvent.id() === this.id()) {
        this._dx = this.x() - prevEvent.x();
        this._dy = this.y() - prevEvent.y();
        this._distance = MotionEvent.distance(this._x, this._y, prevEvent.x(), prevEvent.y());
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
    return this.x() - this.dx();
  }

  /**
   * @return dof-2, only meaningful if the event {@link #isRelative()}
   */
  y() {
    return this._y;
  }

  /**
   * @return dof-2 delta
   */
  dy() {
    return this._dy;
  }

  /**
   * @return previous dof-2, only meaningful if the event {@link #isRelative()}
   */
  prevY() {
    return this.y() - this.dy();
  }

  modulate(sens) {
    if (sens !== null) {
      if (sens.length >= 2 && this.isAbsolute()) {
        this._dx = this._dx * sens[0];
        this._dy = this._dy * sens[1];
      }
    }
  }

  isNull() {
    if (this.dx() === 0 && this.dy() === 0) return true;
    return false;
  }

  /**
   * Reduces the event to a {@link remixlab.bias.event.DOF1Event} (lossy reduction).
   *
   * @param fromX if true keeps dof-1, else keeps dof-2
   */
  dof1Event(fromX = true) {
    let pe1;
    let e1;
    if (fromX) {
      if (this.isRelative()) {
        pe1 = new DOF1Event(null, this.prevX(), this.modifiers(), this.id());
        e1 = new DOF1Event(pe1, this.x(), this.modifiers(), this.id());
      } else {
        e1 = new DOF1Event(this.dx(), this.modifiers(), this.id());
      }
    } else if (this.isRelative()) {
      pe1 = new DOF1Event(null, this.prevY(), this.modifiers(), this.id());
      e1 = new DOF1Event(pe1, this.y(), this.modifiers(), this.id());
    } else {
      e1 = new DOF1Event(this.dy(), this.modifiers(), this.id());
    }
    e1.delay = this.delay();
    e1.speed = this.speed();
    e1.distance = this.distance();
    if (this.fired()) return e1.fire();
    else if (this.flushed()) return e1.flush();
    return e1;
  }
}
