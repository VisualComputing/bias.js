/**************************************************************************************
 * bias_tree
 * Copyright (c) 2014-2017 National University of Colombia, https://github.com/remixlab
 * @author Jean Pierre Charalambos, http://otrolado.info/
 *
 * All rights reserved. Library that eases the creation of interactive
 * scenes, released under the terms of the GNU Public License v3.0
 * which is available at http://www.gnu.org/licenses/gpl.html
 **************************************************************************************/

package remixlab.bias;

import remixlab.bias.event.KeyEvent;
import remixlab.bias.event.KeyShortcut;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;

/**
 * Every {@link Event} instance has a shortcut which represents a
 * gesture-{@link #id()}. For instance, the button being dragged and the modifier key
 * pressed (see {@link #modifiers()}) at the very moment an user interaction takes place,
 * such as when she drags a giving mouse button while pressing the 'CTRL' modifier key.
 * See {@link Event#shortcut()}.
 * <p>
 * The current implementation supports the following event/shortcut types:
 * <ol>
 * <li>{@link remixlab.bias.event.MotionEvent} /
 * {@link remixlab.bias.Shortcut}. Note that motion-event derived classes:
 * {@link remixlab.bias.event.DOF1Event}, {@link remixlab.bias.event.DOF2Event},
 * {@link remixlab.bias.event.DOF3Event}, {@link remixlab.bias.event.DOF6Event}, are also
 * related to shortcuts.</li>
 * <li>{@link remixlab.bias.event.ClickEvent} / {@link remixlab.bias.event.ClickShortcut}
 * </li>
 * <li>{@link KeyEvent} /
 * {@link KeyShortcut}</li>
 * </ol>
 */
class Shortcut {
  final int mask;
  final int id;

  /**
   * Constructs an "empty" shortcut. Same as: {@link #Shortcut(int)} with the integer
   * parameter being NO_NOMODIFIER_MASK.
   */
  Shortcut() {    
  }

  /**
   * Defines a shortcut from the given id.
   *
   * @param _id gesture-id
   */
  Shortcut(int _id) {
  }

  /**
   * Defines a shortcut from the given modifier mask and id
   *
   * @param m modifier mask defining the shortcut
   */
  Shortcut(int m, int i) {
  }

  /**
   * Returns the shortcut's modifiers mask.
   */
  int modifiers() {
  }

  /**
   * Returns the shortcut's id.
   */
  int id() {
  }

  /**
   * Returns whether or not this shortcut matches the other.
   *
   * @param other shortcut
   */
  matches(Shortcut other) {
    return id() == other.id() && modifiers() == other.modifiers();
  }
}
