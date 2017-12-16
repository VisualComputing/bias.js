import { NO_ID, NO_MODIFIER_MASK } from '../Event';
import MotionEvent from './MotionEvent';
import MotionEvent2 from './MotionEvent2';
/**
 * A {@link remixlab.bias.event.MotionEvent} with three degrees-of-freedom ( {@link #x()},
 * {@link #y()} and {@link #z()} ).
 */
export default class MotionEvent3 extends MotionEvent {
  constructor({
    x = 0, y = 0, z = 0, dx = 0, dy = 0, dz = 0,
    modifiers = NO_MODIFIER_MASK, id = NO_ID, previous,
    other = null } = {}) {
    if (other) {
      super({ other });
      this._x = other._x; this._dx = other._dx; this._y = other._y;
      this._dy = other._dy; this._z = other._z; this._dz = other._dz;
    } else if (previous !== undefined) {
      super({ modifiers, id });
      this._x = x; this._y = y; this._z = z;
      this._dx = dx; this._dy = dy; this._dz = dz;
      this.setPreviousEvent(previous);
    } else if (dx !== null && dy !== null && dz !== null) {
      super({ modifiers, id });
      this._dx = dx; this._dy = dy; this._dz = dz;
    } else {
      throw Error("Invalid number of parameters in MotionEvent3 instantiation");
    }
  }

  get() {
    return new MotionEvent3({ other: this });
  }

  flush() {
    return super.flush();
  }

  fire() {
    return super.fire();
  }

  setPreviousEvent(previous) {
    this._relative = true;
    if (previous !== null) {
      if (previous instanceof MotionEvent3 && previous.id() === this.id()) {
        this._dx = this.x() - previous.x();
        this._dy = this.y() - previous.y();
        this._dz = this.z() - previous.z();
        this._distance = MotionEvent.distance(
          this._x, this._y, this._z,
          previous.x(), previous.y(), previous.z(),
        );
        this._delay = this.timestamp() - previous.timestamp();
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
  previousX() {
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
  previousY() {
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
  previousZ() {
    return this.z() - this.dz();
  }

  isNull() {
    if (this.dx() === 0 && this.dy() === 0 && this.dz() === 0 &&
    !this.fired() && !this.flushed()
    ) return true;
    return false;
  }

  /**
   * Reduces the event to a {@link remixlab.bias.event.MotionEvent2} (lossy reduction). Keeps
   * dof-1 and dof-2 and discards dof-3.
   */
  event2() {
    let pe2;
    let e2;
    if (this.isRelative()) {
      pe2 = new MotionEvent2({
        previous: null,
        x: this.previousX(),
        y: this.previousY(),
        modifiers: this.modifiers(),
        id: this.id(),
      });
      e2 = new MotionEvent2({
        previous: pe2,
        x: this.x(),
        y: this.y(),
        modifiers: this.modifiers(),
        id: this.id(),
      });
    } else {
      e2 = new MotionEvent2({
        dx: this.dx(),
        dy: this.dy(),
        modifiers: this.modifiers(),
        id: this.id(),
      });
    }
    e2._delay = this.delay();
    e2._speed = this.speed();
    e2._distance = this.distance();
    if (this.fired()) return e2.fire();
    else if (this.flushed()) return e2.flush();
    return e2;
  }
}
