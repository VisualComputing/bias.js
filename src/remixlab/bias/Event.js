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

/**
 * The root of all events that are to be handled by an {@link Agent}.
 * Every Event encapsulates a {@link Shortcut}. Gesture initialization and
 * termination, which may be of the interest of {@link Grabber}
 * objects, are reported by {@link #fired()} and {@link #flushed()}, respectively.
 * <p>
 * The following are the main class specializations:
 * {@link remixlab.bias.event.MotionEvent}, {@link remixlab.bias.event.ClickEvent}, and
 * {@link KeyEvent}. Please refer to their documentation for
 * details.
 * <p>
 * If you ever need to define you're own event type, derive from this class; and, optional,
 * declare a shortcut type for your event (overriding the {@link #shortcut()). For details
 * refer to the {@link Shortcut}. If your custom event class defines it's own attributes, its
 * {@link #get()} method should be overridden.
 * <p>
 * <b>Note</b> Event detection/reduction could happened in several different ways.
 * For instance, in the context of Java-based application, it typically takes place when
 * implementing a mouse listener interface. In Processing, it does it when registering at
 * the PApplet the so called mouseEvent and KeyEvent methods. Moreover, the
 * {@link Agent#handleFeed()} provides a callback alternative when none
 * of these mechanisms are available (as it often happens when dealing with specialized,
 * non-default input hardware).
 */
class Event {
  // modifier keys
  static final int NO_MODIFIER_MASK = 0;
  static final int NO_ID = 0;
  static final int SHIFT = 1 << 0;
  static final int CTRL = 1 << 1;
  static final int META = 1 << 2;
  static final int ALT = 1 << 3;
  static final int ALT_GRAPH = 1 << 4;

  private fire, flush;

  final int modifiers;
  long timestamp;
  int id;

  /**
   * Constructs an event with an "empty" {@link Shortcut}.
   */
  Event() {
  }

  /**
   * Constructs an event taking the given {@code modifiers} as a
   * {@link Shortcut}.
   */
  Event(int modifiers, int id) {
    }

  Event(Event other) {
    }

  Event get() {
    }

  /**
   * Same as {@code this.get()} but sets the {@link #flushed()} flag to true. Only agents
   * may call this.
   *
   * @see #flushed()
   */
  Event flush() {
  }

  /**
   * Same as {@code this.get()} but sets the {@link #fired()} flag to true. Only agents
   * may call this.
   *
   * @see #flushed()
   */
  Event fire() {
  }

  /**
   * Returns true if this is a 'flushed' event. Flushed events indicate gesture
   * termination, such as a mouse-release.
   *
   * @see #fired()
   */
  flushed() {
    
  }

  /**
   * Returns true if this is a 'fired' event. Fired events indicate gesture activation,
   * such as a mouse-press.
   *
   * @see #flushed()
   */
  fired() {
    }

  /**
   * @return the shortcut encapsulated by this event.
   * @see Shortcut
   */
  Shortcut shortcut() {
    }

  /**
   * @return the modifiers defining the event {@link Shortcut}.
   */
  int modifiers() {
    }

  /**
   * Returns the id defining the event's {@link Shortcut}.
   */
  int id() {
    }

  /**
   * @return the time at which the event occurs
   */
  long timestamp() {
    }

  /**
   * Only {@link remixlab.bias.event.MotionEvent}s may be null.
   */
  isNull() {
    }

  /**
   * @return true if Shift was down when the event occurs
   */
  isShiftDown() {
    }

  /**
   * @return true if Ctrl was down when the event occurs
   */
  isControlDown() {
    }

  /**
   * @return true if Meta was down when the event occurs
   */
  isMetaDown() {
    }

  /**
   * @return true if Alt was down when the event occurs
   */
  isAltDown() {
    }

  /**
   * @return true if AltGraph was down when the event occurs
   */
  isAltGraph() {
    }

  /**
   * @param mask of modifiers
   * @return a String listing the event modifiers
   */
  static String modifiersText(int mask) {    
  }
}
