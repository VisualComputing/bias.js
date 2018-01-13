/**************************************************************************************
 * bias_tree
 * Copyright (c) 2014-2017 National University of Colombia, https://github.com/remixlab
 * @author Jean Pierre Charalambos, http://otrolado.info/
 *
 * All rights reserved. Library that eases the creation of interactive
 * scenes, released under the terms of the GNU Public License v3.0
 * which is available at http://www.gnu.org/licenses/gpl.html
 **************************************************************************************/

import Event, { NO_ID, NO_MODIFIER_MASK } from '../Event';
import MotionEvent1 from './MotionEvent1';
import MotionEvent2 from './MotionEvent2';
import MotionEvent3 from './MotionEvent3';
import MotionEvent6 from './MotionEvent6';

/**
 * Base class of all motion events defined from DOFs (degrees-of-freedom).
 * <p>
 * MotionEvents may be relative or absolute (see {@link #isRelative()}, {@link #isAbsolute()})
 * depending whether or not they're constructed from a previous MotionEvent. While
 * relative motion events have {@link #distance()}, {@link #speed()}, and
 * {@link #delay()}, absolute motion events don't.
 */
export default class MotionEvent extends Event {
  constructor({ modifiers = NO_MODIFIER_MASK, id = NO_ID, other = null } = {}) {
    if (other !== null) {
      super({ other });
      this._delay = other._delay;
      this._distance = other._distance;
      this._speed = other._speed;
      this._relative = other._relative;
    } else {
      super({ modifiers, id });
      this._delay = 0;
      this._distance = 0;
      this._speed = 0;
      this._relative = false;
    }
  }

  get() {
    return new MotionEvent({ other: this });
  }

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
    return this._relative;
  }

  /**
   * Returns true if the motion event is absolute, i.e., it hasn't been built from a
   * previous motion event.
   */
  isAbsolute() {
    return !this.isRelative();
  }

  /**
   * Sets the event's previous event to build a relative event.
   */
  _setPrevious(previous) {
    this._relative = true;
    // makes sense only if derived classes call it
    if (previous !== null) {
      if (previous.id() === this.id()) {
        this._delay = this.timestamp() - previous.timestamp();
        if (this._delay === 0) this._speed = this._distance;
        else this._speed = this._distance / this._delay;
      }
    }
  }

  /**
   * Returns a {@link MotionEvent1} from the MotionEvent x-coordinate if
   * {@code fromX} is {@code true} and from the y-coordinate otherwise.
   */
  static event1(event, fromX = true) {
    if (event instanceof MotionEvent1) return event;
    if (event instanceof MotionEvent2) return event.event1(fromX);
    if (event instanceof MotionEvent3) return event.event2().event1(fromX);
    if (event instanceof MotionEvent6) {
      return event.event3(fromX).event2().event1(fromX);
    }
    return null;
  }


  /**
   * Returns a {@link MotionEvent2} from the MotionEvent x-coordinate if
   * {@code fromX} is {@code true} and from the y-coordinate otherwise.
   */
  static event2(event, fromX = true) {
    if (event instanceof MotionEvent1) return null;
    if (event instanceof MotionEvent2) return event;
    if (event instanceof MotionEvent3) return event.event2();
    if (event instanceof MotionEvent6) return event.event3(fromX).event2();
    return null;
  }

  /**
   * Returns a {@link MotionEvent3} from the MotionEvent
   * translation-coordinates if {@code fromTranslation} is {@code true} and from the
   * rotation-coordinate otherwise.
   */
  static event3(event, fromTranslation = true) {
    if (event instanceof MotionEvent1) return null;
    if (event instanceof MotionEvent2) return null;
    if (event instanceof MotionEvent3) return event;
    if (event instanceof MotionEvent6) return event.event3(fromTranslation);
    return null;
  }

  /**
   * Returns a {@link MotionEvent6} if the MotionEvent {@code instanceof}
   * {@link MotionEvent6} and null otherwise..
   */
  static event6(event) {
    if (event instanceof MotionEvent6) return event;
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
