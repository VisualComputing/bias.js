import MotionEvent from './MotionEvent';
import DOF2Event from './DOF2Event';
/**
 * A {@link remixlab.bias.event.MotionEvent} with three degrees-of-freedom ( {@link #x()},
 * {@link #y()} and {@link #z()} ).
 */
export default class DOF3Event extends MotionEvent {

  constructor({
    x = 0,
    y = 0,
    z = 0,
    dx = 0,
    dy = 0,
    dz = 0,
    modifiers = null,
    id = null,
    prevEvent = null,
    other = null }) {
    if (other) {
      super({ other });
      this._x = other.x;
      this._dx = other.dx;
      this._y = other.y;
      this._dy = other.dy;
      this._z = other.z;
      this._dz = other.dz;
    } else if (prevEvent !== null) {
      super({ modifiers, id });
      this.setPreviousEvent(prevEvent);
      this._x = x;
      this._y = y;
      this._z = z;
      this._dx = dx;
      this._dy = dy;
      this._dz = dz;
    } else if (dx !== null && dy !== null && dz !== null && modifiers !== null && id !== null) {
      super({ modifiers, id });
      this._x = x;
      this._y = y;
      this._z = z;
      this._dx = dx;
      this._dy = dy;
      this._dz = dz;
    } else {
      super();
      this._x = x;
      this._y = y;
      this._z = z;
      this._dx = dx;
      this._dy = dy;
      this._dz = dz;
    }
  }

  get() {
    return new DOF3Event({ other:this });
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
      if (prevEvent instanceof DOF3Event && prevEvent.id() === this.id()) {
        this._dx = this.x() - prevEvent.x();
        this._dy = this.y() - prevEvent.y();
        this._dz = this.z() - prevEvent.z();
        this._distance = MotionEvent.distance(
            this._x, this._y, this._z,
            prevEvent.x(), prevEvent.y(), prevEvent.z());
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

  /**
   * @return dof-3, only meaningful if the event {@link #isRelative()}
   */
  z() {
    return this._z;
  }

  /**
   * @return dof-3 delta
   */
  dz() {
    return this._dz;
  }

  /**
   * @return previous dof-3, only meaningful if the event {@link #isRelative()}
   */
  prevZ() {
    return this.z() - this.dz();
  }

  modulate(sens) {
    if (sens !== null) {
      if (sens.length >= 3 && this.isAbsolute()) {
        this._dx = this._dx * sens[0];
        this._dy = this._dy * sens[1];
        this._dz = this._dz * sens[2];
      }
    }
  }

  isNull() {
    if (this.dx() === 0 && this.dy() === 0 && this.dz() === 0) return true;
    return false;
  }

  /**
   * Reduces the event to a {@link remixlab.bias.event.DOF2Event} (lossy reduction). Keeps
   * dof-1 and dof-2 and discards dof-3.
   */
  dof2Event() {
    let pe2;
    let e2;
    if (this.isRelative()) {
      pe2 = new DOF2Event(null, this.prevX(), this.prevY(), this.modifiers(), this.id());
      e2 = new DOF2Event(pe2, this.x(), this.y(), this.modifiers(), this.id());
    } else {
      e2 = new DOF2Event(this.dx(), this.dy(), this.modifiers(), this.id());
    }
    e2._delay = this.delay();
    e2._speed = this.speed();
    e2._distance = this.distance();
    if (this.fired()) return e2.fire();
    else if (this.flushed()) return e2.flush();
    return e2;
  }
}
