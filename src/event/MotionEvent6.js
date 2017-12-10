import { NO_ID } from '../Event';
import MotionEvent from './MotionEvent';
import MotionEvent3 from './MotionEvent3';

/**
 * A {@link remixlab.bias.event.MotionEvent} with six degrees-of-freedom ( {@link #x()},
 * {@link #y()}, {@link #z()} , {@link #rx()}, {@link #ry()} and {@link #rz()}).
 */
export default class MotionEvent6 extends MotionEvent {
  constructor({
    x = 0, y = 0, z = 0, dx = 0, dy = 0, dz = 0,
    rx = 0, ry = 0, rz = 0, drx = 0, dry = 0, drz = 0,
    modifiers = null, id = NO_ID, previous, other = null
  } = {}) {
    if (other) {
      super({ other });
      this._x = other._x; this._dx = other._dx;
      this._y = other._y; this._dy = other._dy;
      this._z = other._z; this._dz = other._dz;
      this._rx = other._rx; this._drx = other._drx;
      this._ry = other._ry; this._dry = other._dry;
      this._rz = other._rz; this._drz = other._drz;
    } else if (previous !== undefined) {
      super({ modifiers, id });
      this.setPreviousEvent(previous);
      this._x = x; this._y = y; this._z = z;
      this._rx = rx; this._ry = ry; this._rz = rz;
    } else if (
      dx !== null && dy !== null && dz !== null &&
      drx !== null && dry !== null && drz !== null) {
      super({ modifiers, id });
      this._dx = dx; this._dy = dy; this._dz = dz;
      this._drx = drx; this._dry = dry; this._drz = drz;
    } else {
      throw Error("Invalid number of parameters in MotionEvent6 instantiation");
    }
  }

  get() {
    return new MotionEvent6({ other: this });
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
      if (previous instanceof MotionEvent6 && previous.id() === this.id()) {
        this._dx = this.x() - previous.x();
        this._dy = this.y() - previous.y();
        this._dz = this.z() - previous.z();
        this._drx = this.rx() - previous.rx();
        this._dry = this.ry() - previous.ry();
        this._drz = this.rz() - previous.rz();
        this._distance = MotionEvent.distance(
          this._x, this._y, this._z,
          this._rx, this._ry, this._rz,
          previous.x(), previous.y(), previous.z(),
          previous.rx(), previous.ry(), previous.rz(),
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
  previousRX() {
    return this._rx() - this._drx();
  }

  /**
   * @return previous dof5, only meaningful if the event {@link #isRelative()}
   */
  previousRY() {
    return this._ry() - this._dry();
  }

  /**
   * @return previous dof6, only meaningful if the event {@link #isRelative()}
   */
  previousRZ() {
    return this._rz() - this._drz();
  }

  isNull() {
    if (
      this.dx() === 0 && this.dy() === 0 && this.dz() === 0 &&
      this.drx() === 0 && this.dry() === 0 && this.drz() === 0 &&
      !this.fired() && !this.flushed()
    ) return true;
    return false;
  }

  /**
   * Reduces the event to a {@link remixlab.bias.event.MotionEvent3} (lossy reduction).
   *
   * @param fromTranslation if true keeps dof1, dof2 and dof3; otherwise keeps dof4, dof4 and dof6.
   */
  event3(fromTranslation = true) {
    let pe3;
    let e3;
    if (this.isRelative()) {
      if (fromTranslation) {
        pe3 = new MotionEvent3({
          previous: null,
          x: this.prevX(),
          y: this.prevY(),
          z: this.prevZ(),
          modifiers: this.modifiers(),
          id: this.id(),
        });
        e3 = new MotionEvent3({
          previous: pe3,
          x: this.x(),
          y: this.y(),
          z: this.z(),
          modifiers: this.modifiers(),
          id: this.id(),
        });
      } else {
        pe3 = new MotionEvent3({
          previous: null,
          x: this.prevRX(),
          y: this.prevRY(),
          z: this.prevRZ(),
          modifiers: this.modifiers(),
          id: this.id(),
        });
        e3 = new MotionEvent3({
          previous: pe3,
          x: this.rx(),
          y: this.ry(),
          z: this.rz(),
          modifiers: this.modifiers(),
          id: this.id(),
        });
      }
    } else if (fromTranslation) {
      e3 = new MotionEvent3({
        dx: this.dx(),
        dy: this.dy(),
        dz: this.dz(),
        modifiers: this.modifiers(),
        id: this.id(),
      });
    } else {
      e3 = new MotionEvent3({
        dx: this.drx(),
        dy: this.dry(),
        dz: this.drz(),
        modifiers: this.modifiers(),
        id: this.id(),
      });
    }
    e3._delay = this.delay();
    e3._speed = this.speed();
    e3._distance = this.distance();
    if (this.fired()) return e3.fire();
    else if (this.flushed()) return e3.flush();
    return e3;
  }
}
