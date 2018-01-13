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

/**
 * A {@link remixlab.bias.event.MotionEvent} with one degree of freedom ( {@link #x()}).
 */
export default class MotionEvent1 extends MotionEvent {
  /**
   * Construct an absolute DOF1 motion event.
   *
   * @param dx        1-dof
   * @param x         1-dof
   * @param previous
   * @param modifiers MotionShortcut modifiers
   * @param id        MotionShortcut gesture-id
   */
  constructor({ x = 0, dx = 0, modifiers = NO_MODIFIER_MASK, id = NO_ID, previous, other = null } = {}) {
    if (other !== null) {
      super({ other });
      this._x = other._x;
      this._dx = other._dx;
    } else if (previous !== undefined) {
      super({ modifiers, id });
      this._x = x;
      this._dx = dx;
      this._setPrevious(previous);
    } else if (dx !== null) {
      super({ modifiers, id });
      this._dx = dx;
    } else {
      throw Error("Invalid number of parameters in MotionEvent1 instantiation");
    }
  }

  get() {
    return new MotionEvent1({ other: this });
  }

  _setPrevious(previous) {
    this._relative = true;
    if (previous !== null) {
      if (previous instanceof MotionEvent1 && previous.id() === this.id()) {
        this._dx = this.x() - previous.x();
        this._distance = this.x() - previous.x();
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
    return this._x() - this._dx();
  }

  isNull() {
    if (this.dx() === 0 && !this.fired() && !this.flushed()) return true;
    return false;
  }
}
