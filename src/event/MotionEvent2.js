/**************************************************************************************
 * bias_tree
 * Copyright (c) 2014-2017 National University of Colombia, https://github.com/remixlab
 * @author Jean Pierre Charalambos, http://otrolado.info/
 *
 * All rights reserved. Library that eases the creation of interactive
 * scenes, released under the terms of the GNU Public License v3.0
 * which is available at http://www.gnu.org/licenses/gpl.html
 **************************************************************************************/

import { NO_ID, NO_MODIFIER_MASK } from '../Event';
import MotionEvent from './MotionEvent';
import MotionEvent1 from './MotionEvent1';

/**
 * A {@link remixlab.input.event.MotionEvent} with two degrees-of-freedom ({@link #x()}
 * and {@link #y()}).
 */
export default class MotionEvent2 extends MotionEvent {
  /**
   * Construct from the given dof's and modifiers.
   *
   * @param x
   * @param y
   * @param dx
   * @param dy
   * @param modifiers
   * @param id
   * @param previous
   * @param other
   */
  constructor({
    x = 0, y = 0, dx = 0, dy = 0, modifiers = NO_MODIFIER_MASK,
    id = NO_ID, previous, other = null } = {}) {
    if (other) {
      super({ other });
      this._x = other._x; this._dx = other._dx;
      this._y = other._y; this._dy = other._dy;
    } else if (previous !== undefined) {
      super({ modifiers, id });
      this._setPrevious(previous);
      this._x = x; this._y = y;
    } else if (dx !== null && dy !== null) {
      super({ modifiers, id });
      this._dx = dx; this._dy = dy;
    } else {
      throw Error("Invalid number of parameters in MotionEvent2 instantiation");
    }
  }

  get() {
    return new MotionEvent2({ other: this });
  }

  flush() {
    return super.flush();
  }

  fire() {
    return super.fire();
  }

  _setPrevious(previous) {
    this._relative = true;
    if (previous !== null) {
      if (previous instanceof MotionEvent2 && previous.id() === this.id()) {
        this._dx = this.x() - previous.x();
        this._dy = this.y() - previous.y();
        this._distance = MotionEvent.distance(this._x, this._y, previous.x(), previous.y());
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

  isNull() {
    if (this.dx() === 0 && this.dy() === 0 && !this.fired() && !this.flushed()) return true;
    return false;
  }

  /**
   * Reduces the event to a {@link remixlab.bias.event.MotionEvent1} (lossy reduction).
   *
   * @param fromX if true keeps dof-1, else keeps dof-2
   */
  MotionEvent1(fromX = true) {
    let pe1;
    let e1;
    if (fromX) {
      if (this.isRelative()) {
        pe1 = new MotionEvent1({
          previous: null, x: this.previousX(), modifiers: this.modifiers(), id: this.id(),
        });
        e1 = new MotionEvent1({
          previous: pe1, x: this.x(), modifiers: this.modifiers(), id: this.id(),
        });
      } else {
        e1 = new MotionEvent1({ dx: this.dx(), modifiers: this.modifiers(), id: this.id() });
      }
    } else if (this.isRelative()) {
      pe1 = new MotionEvent1({
        previous: null, x: this.previousY(), modifiers: this.modifiers(), id: this.id(),
      });
      e1 = new MotionEvent1({
        previous: pe1, x: this.y(), modifiers: this.modifiers(), id: this.id(),
      });
    } else {
      e1 = new MotionEvent1({ dx: this.dy(), modifiers: this.modifiers(), id: this.id() });
    }
    e1._delay = this.delay();
    e1._speed = this.speed();
    e1._distance = this.distance();
    if (this.fired()) return e1.fire();
    else if (this.flushed()) return e1.flush();
    return e1;
  }
}
