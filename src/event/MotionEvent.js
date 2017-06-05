import Event, { NO_ID } from '../Event';

import DOF1Event from './DOF1Event';
import DOF2Event from './DOF2Event';
import DOF3Event from './DOF3Event';
import DOF6Event from './DOF6Event';

/**
 * Base class of all DOF_n_Events: {@link Event}s defined from
 * DOFs (degrees-of-freedom).
 * <p>
 * MotionEvents may be relative or absolute (see {@link #isRelative()}, {@link #isAbsolute()})
 * depending whether or not they're constructed from a previous MotionEvent. While
 * relative motion events have {@link #distance()}, {@link #speed()}, and
 * {@link #delay()}, absolute motion events don't.
 */
export default class MotionEvent extends Event {
  constructor({ modifiers = null, id = NO_ID, other = null }) {
    if ((modifiers === null, id === null, other === null)) {
      super();
    } else if (other !== null) {
      super(other);
    } else if (id === null) {
      super(modifiers, NO_ID);
    } else {
      super(modifiers, id);
    }
    this._delay = 0;
    this._distance = 0;
    this._speed = 0;
    this.rel = false;
    if (other !== null) {
      this._delay = other._delay;
      this._distance = other._distance;
      this._speed = other._speed;
      this._rel = other._rel;
    }
  }

  get() {
    return new MotionEvent(this);
  }

  flush() {
    super.flush();
  }

  fire() {
    super.fire();
  }

  /**
   * Modulate the event dofs according to {@code sens}. Only meaningful if the event
   * {@link #isAbsolute()}.
   */
  modulate(sens) {}

  /**
   * Returns the delay between two consecutive motion events. Meaningful only if the event
   * {@link #isRelative()}.
   */
  delay() {
    return this._delay;
  }

  /**
   * Returns the distance between two consecutive motion events. Meaningful only if the
   * event {@link #isRelative()}.
   */
  distance() {
    return this._distance;
  }

  /**
   * Returns the speed between two consecutive motion events. Meaningful only if the event
   * {@link #isRelative()}.
   */
  speed() {
    return this._speed;
  }

  /**
   * Returns true if the motion event is relative, i.e., it has been built from a previous
   * motion event.
   */
  isRelative() {
    // return distance() != 0;
    return this._rel;
  }

  /**
   * Returns true if the motion event is absolute, i.e., it hasn't been built from a
   * previous motion event.
   */
  isAbsolute() {
    return !this._isRelative();
  }

  /**
   * Sets the event's previous event to build a relative event.
   */
  setPreviousEvent(prevEvent) {
    this._rel = true;
    // makes sense only if derived classes call it
    if (prevEvent != null) {
      if (prevEvent.id() === this.id()) {
        this._delay = this.timestamp() - prevEvent.timestamp();
        if (this._delay === 0) this._speed = this._distance;
        else this._speed = this._distance / this._delay;
      }
    }
  }

  /**
   * Returns a {@link remixlab.bias.event.DOF1Event} from the MotionEvent x-coordinate if
   * {@code fromX} is {@code true} and from the y-coordinate otherwise.
   */
  static dof1Event(event, fromX = true) {
    if (event instanceof DOF1Event) return event;
    if (event instanceof DOF2Event) return event.dof1Event(fromX);
    if (event instanceof DOF3Event) return event.dof2Event().dof1Event(fromX);
    if (event instanceof DOF6Event) {
      return event.dof3Event(fromX).dof2Event().dof1Event(fromX);
    }
    return null;
  }


  /**
   * Returns a {@link remixlab.bias.event.DOF2Event} from the MotionEvent x-coordinate if
   * {@code fromX} is {@code true} and from the y-coordinate otherwise.
   */
  static dof2Event(event, fromX = true) {
    if (event instanceof DOF1Event) return null;
    if (event instanceof DOF2Event) return event;
    if (event instanceof DOF3Event) return event.dof2Event();
    if (event instanceof DOF6Event) return event.dof3Event(fromX).dof2Event();
    return null;
  }

  /**
   * Returns a {@link remixlab.bias.event.DOF3Event} from the MotionEvent
   * translation-coordinates if {@code fromTranslation} is {@code true} and from the
   * rotation-coordinate otherwise.
   */
  static dof3Event(event, fromTranslation = true) {
    if (event instanceof DOF1Event) return null;
    if (event instanceof DOF2Event) return null;
    if (event instanceof DOF3Event) return event;
    if (event instanceof DOF6Event) return event.dof3Event(fromTranslation);
    return null;
  }

  /**
   * Returns a {@link remixlab.bias.event.DOF6Event} if the MotionEvent {@code instanceof}
   * {@link remixlab.bias.event.DOF6Event} and null otherwise..
   */
  static dof6Event(event) {
    if (event instanceof DOF6Event) return event;
    return null;
  }

  /**
   * @return Euclidean distance between points
   *
   */
  static distance(...args) {
    if (args.length === 4) return this.distance2(...args);
    if (args.length === 6) return this.distance3(...args);
    if (args.length === 12) return this.distance6(...args);
    return 0;
  }

  /**
   * @return Euclidean distance between points (x1,y1) and (x2,y2).
   *
   */
  static distance2(x1, y1, x2, y2) {
    return Math.sqrt(
      ((x2 - x1) ** 2) +
      ((y2 - y1) ** 2));
  }
  /**
   * @return Euclidean distance between points (x1,y1,z1) and (x2,y2,z2).
   */
  static distance3(x1, y1, z1, x2, y2, z2) {
    return Math.sqrt(
      ((x2 - x1) ** 2) +
      ((y2 - y1) ** 2) +
      ((z2 - z1) ** 2));
  }

  /**
   * @return Euclidean distance between points (x1,y1,z1,rx1,y1,rz1) and
   * (x2,y2,z2,rx2,y2,rz2).
   */
  static distance6(x1, y1, z1, rx1, ry1, rz1, x2, y2, z2, rx2, ry2, rz2) {
    return Math.sqrt(
      ((x2 - x1) ** 2) +
      ((y2 - y1) ** 2) +
      ((z2 - z1) ** 2) +
      ((rx2 - rx1) ** 2) +
      ((ry2 - ry1) ** 2) +
      ((rz2 - rz1) ** 2));
  }
}
