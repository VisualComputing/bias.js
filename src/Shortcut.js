/**************************************************************************************
 * bias_tree
 * Copyright (c) 2014-2017 National University of Colombia, https://github.com/remixlab
 * @author Jean Pierre Charalambos, http://otrolado.info/
 *
 * All rights reserved. Library that eases the creation of interactive
 * scenes, released under the terms of the GNU Public License v3.0
 * which is available at http://www.gnu.org/licenses/gpl.html
 **************************************************************************************/

/**
 * Every {@link Event} instance has a shortcut which represents a
 * gesture-{@link #id()}. For instance, the button being dragged and the modifier key
 * pressed (see {@link #modifiers()}) at the very moment an user interaction takes place,
 * such as when she drags a giving mouse button while pressing the 'CTRL' modifier key.
 * See {@link Event#shortcut()}.
 * <p>
 * The current implementation supports the following event/shortcut types:
 * <ol>
 * <li>{@link remixlab.input.event.MotionEvent} /
 * {@link remixlab.input.Shortcut}. Note that motion-event derived classes:
 * {@link MotionEvent1}, {@link MotionEvent2},
 * {@link MotionEvent3}, {@link MotionEvent6}, are also
 * related to shortcuts.</li>
 * <li>{@link TapEvent} / {@link TapShortcut}
 * </li>
 * </ol>
 */

import { NO_MODIFIER_MASK, NO_ID } from './Event';

export default class Shortcut {
  /**
   * Constructs an "empty" shortcut. Same as: {@link #Shortcut(int)} with the integer
   * parameter being NO_NOMODIFIER_MASK if no parametes are passed.
   * @param mask modifier mask defining the shortcut
   * @param id gesture ig
   */
  constructor({ modifiers = null, id = null }) {
    this._modifiers = modifiers || NO_MODIFIER_MASK;
    this._id = id || NO_ID;
  }
  /**
   * Returns the shortcut's modifiers mask.
   */
  modifiers() {
    return this._modifiers;
  }

  /**
   * Returns the shortcut's id.
   */
  id() {
    return this._id;
  }

  /**
   * Returns whether or not this shortcut matches the other.
   *
   * @param other shortcut
   */
  matches(other) {
    return this.id() === other.id() && this.modifiers() === other.modifiers();
  }
}
