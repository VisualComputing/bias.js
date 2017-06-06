import MotionEvent from './MotionEvent';
import DOF3Event from './DOF3Event';

/**
 * A {@link remixlab.bias.event.MotionEvent} with six degrees-of-freedom ( {@link #x()},
 * {@link #y()}, {@link #z()} , {@link #rx()}, {@link #ry()} and {@link #rz()}).
 */
export default class DOF6Event extends MotionEvent {
  constructor({
    x = 0,
    y = 0,
    z = 0,
    dx = 0,
    dy = 0,
    dz = 0,
    rx = 0,
    ry = 0,
    rz = 0,
    drx = 0,
    dry = 0,
    drz = 0,
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
      this._rx = other.rx;
      this._drx = other.drx;
      this._ry = other.ry;
      this._dry = other.dry;
      this._rz = other.rz;
      this._drz = other.drz;
    } else if (prevEvent !== null) {
      super({ modifiers, id });
      this.setPreviousEvent(prevEvent);
      this._x = x;
      this._y = y;
      this._z = z;
      this._dx = dx;
      this._dy = dy;
      this._dz = dz;
      this._rx = rx;
      this._ry = ry;
      this._rz = rz;
      this._drx = drx;
      this._dry = dry;
      this._drz = drz;
    } else if (
      dx !== null && dy !== null && dz !== null &&
      drx !== null && dry !== null && drz !== null &&
      modifiers !== null && id !== null) {
      super({ modifiers, id });
      this._x = x;
      this._y = y;
      this._z = z;
      this._dx = dx;
      this._dy = dy;
      this._dz = dz;
      this._rx = rx;
      this._ry = ry;
      this._rz = rz;
      this._drx = drx;
      this._dry = dry;
      this._drz = drz;
    } else {
      super();
      this._x = x;
      this._y = y;
      this._z = z;
      this._dx = dx;
      this._dy = dy;
      this._dz = dz;
      this._rx = rx;
      this._ry = ry;
      this._rz = rz;
      this._drx = drx;
      this._dry = dry;
      this._drz = drz;
    }
  }

  get() {
    return new DOF6Event({ other: this });
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
      if (prevEvent instanceof DOF6Event && prevEvent.id() === this.id()) {
        this._dx = this.x() - prevEvent.x();
        this._dy = this.y() - prevEvent.y();
        this._dz = this.z() - prevEvent.z();
        this._distance = MotionEvent.distance(
            this._x, this._y, this._z,
            this._rx, this._ry, this._rz,
            prevEvent.x(), prevEvent.y(), prevEvent.z(),
            prevEvent.rx(), prevEvent.ry(), prevEvent.rz());
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

  /**
   * Alias for {@link #rx()}, only meaningful if the event {@link #isRelative()}
   */
  roll() {
    return this.rx();
  }

  /**
   * @return dof4, only meaningful if the event {@link #isRelative()}
   */
  rx() {
    return this._rx;
  }

  /**
   * Alias for {@link #ry()}, only meaningful if the event {@link #isRelative()}
   */
  pitch() {
    return this._ry();
  }

  /**
   * @return dof5, only meaningful if the event {@link #isRelative()}
   */
  ry() {
    return this._ry;
  }

  /**
   * alias for {@link #rz()}, only meaningful if the event {@link #isRelative()}
   */
  yaw() {
    return this._rz();
  }

  /**
   * @return dof6, only meaningful if the event {@link #isRelative()}
   */
  rz() {
    return this._rz;
  }

  /**
   * @return dof4 delta
   */
  drx() {
    return this._drx;
  }

  /**
   * @return dof5 delta
   */
  dry() {
    return this._dry;
  }

  /**
   * @return dof6 delta
   */
  drz() {
    return this._drz;
  }

  /**
   * @return previous dof4, only meaningful if the event {@link #isRelative()}
   */
  prevRX() {
    return this._rx() - this._drx();
  }

  /**
   * @return previous dof5, only meaningful if the event {@link #isRelative()}
   */
  prevRY() {
    return this._ry() - this._dry();
  }

  /**
   * @return previous dof6, only meaningful if the event {@link #isRelative()}
   */
  prevRZ() {
    return this._rz() - this._drz();
  }

  modulate(sens) {
    if (sens !== null) {
      if (sens.length >= 6 && this.isAbsolute()) {
        this._dx *= sens[0];
        this._dy *= sens[1];
        this._dz *= sens[2];
        this._drx *= sens[3];
        this._dry *= sens[4];
        this._drz *= sens[5];
      }
    }
  }

  isNull() {
    if (
      this.dx() === 0 && this.dy() === 0 && this.dz() === 0 &&
      this.drx() === 0 && this.dry() === 0 && this.drz() === 0
    ) return true;
    return false;
  }

  /**
   * Reduces the event to a {@link remixlab.bias.event.DOF3Event} (lossy reduction).
   *
   * @param fromTranslation if true keeps dof1, dof2 and dof3; otherwise keeps dof4, dof4 and dof6.
   */
  dof3Event(fromTranslation = true) {
    let pe3;
    let e3;
    if (this.isRelative()) {
      if (fromTranslation) {
        pe3 = new DOF3Event(
          null, this.prevX(), this.prevY(), this.prevZ(), this.modifiers(), this.id());
        e3 = new DOF3Event(pe3, this.x(), this.y(), this.z(), this.modifiers(), this.id());
      } else {
        pe3 = new DOF3Event(
          null, this.prevRX(), this.prevRY(), this.prevRZ(), this.modifiers(), this.id());
        e3 = new DOF3Event(this.pe3, this.rx(), this.ry(), this.rz(), this.modifiers(), this.id());
      }
    } else if (fromTranslation) {
      e3 = new DOF3Event(this.dx(), this.dy(), this.dz(), this.modifiers(), this.id());
    } else {
      e3 = new DOF3Event(this.drx(), this.dry(), this.drz(), this.modifiers(), this.id());
    }
    e3._delay = this.delay();
    e3._speed = this.speed();
    e3._distance = this.distance();
    if (this.fired()) return e3.fire();
    else if (this.flushed()) return e3.flush();
    return e3;
  }
}
