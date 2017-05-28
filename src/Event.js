/**************************************************************************************
 * bias_tree
 * Copyright (c) 2014-2017 National University of Colombia, https://github.com/remixlab
 * @author Jean Pierre Charalambos, http://otrolado.info/
 *
 * All rights reserved. Library that eases the creation of interactive
 * scenes, released under the terms of the GNU Public License v3.0
 * which is available at http://www.gnu.org/licenses/gpl.html
 **************************************************************************************/


import KeyEvent event.KeyEvent;

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

export NO_MODIFIER_MASK = 0;
export NO_ID = 0;
export SHIFT = 1 << 0;
export CTRL = 1 << 1;
export META = 1 << 2;
export ALT = 1 << 3;
export ALT_GRAPH = 1 << 4;

export default class Event {
  constructor(modifiers, id, other) {
    // modifier keys
  
    this._fire; 
    this._flush;

    this._modifiers = NO_MODIFIER_MASK;
    this._timestamp = window.performance.now();
    this._id = NO_ID;
    if (modifiers !== null && id !==null) {
      this._modifiers = modifiers;
      this._id = id;
      this._timestamp = window.performance.now();
    }
    if (other !== null) {
      this._modifiers = other.modifiers;
      this._id = other.id;
      this._timestamp = window.performance.now();
      this._fire = other.fire;
      this._flush = other.flush;
    }
  }

 
  get() {
    return new Event(this);
  }

  /**
   * Same as {@code this.get()} but sets the {@link #flushed()} flag to true. Only agents
   * may call this.
   *
   * @see #flushed()
   */
  flush() {
    if (fired() || flushed()) {
      console.log("Warning: event already " + (fired() ? "fired" : "flushed"));
      return this;
    }
    event = this.get();
    event.flush = true;
    return event;
  }

  /**
   * Same as {@code this.get()} but sets the {@link #fired()} flag to true. Only agents
   * may call this.
   *
   * @see #flushed()
   */
  fire() {
    if (fired() || flushed()) {
      console.log("Warning: event already " + (fired() ? "fired" : "flushed"));
      return this;
    }
    event = this.get();
    event.fire = true;
    return event;
  }

  /**
   * Returns true if this is a 'flushed' event. Flushed events indicate gesture
   * termination, such as a mouse-release.
   *
   * @see #fired()
   */
  flushed() {
    return flush;
  }

  /**
   * Returns true if this is a 'fired' event. Fired events indicate gesture activation,
   * such as a mouse-press.
   *
   * @see #flushed()
   */
  fired() {
    return fire;
  }

  /**
   * @return the shortcut encapsulated by this event.
   * @see Shortcut
   */
  shortcut() {
    return new Shortcut(modifiers(), id());
  }

  /**
   * @return the modifiers defining the event {@link Shortcut}.
   */
  modifiers() {
    return modifiers;
  }

  /**
   * Returns the id defining the event's {@link Shortcut}.
   */
  id() {
    return id;
  }

  /**
   * @return the time at which the event occurs
   */
  timestamp() {
    return timestamp;
  }

  /**
   * Only {@link remixlab.bias.event.MotionEvent}s may be null.
   */
  isNull() {
    return false;
  }

  /**
   * @return true if Shift was down when the event occurs
   */
  isShiftDown() {
    return (modifiers & SHIFT) != 0;
  }

  /**
   * @return true if Ctrl was down when the event occurs
   */
  isControlDown() {
    return (modifiers & CTRL) != 0;
  }

  /**
   * @return true if Meta was down when the event occurs
   */
  isMetaDown() {
    return (modifiers & META) != 0;
  }

  /**
   * @return true if Alt was down when the event occurs
   */
  isAltDown() {
    return (modifiers & ALT) != 0;
  }

  /**
   * @return true if AltGraph was down when the event occurs
   */
  isAltGraph() {
    return (modifiers & ALT_GRAPH) != 0;  
  }

  /**
   * @param mask of modifiers
   * @return a String listing the event modifiers
   */
  modifiersText(mask) {    
    if ((ALT & mask) == ALT)
      r += "ALT";
    if ((SHIFT & mask) == SHIFT)
      r += (r.length() > 0) ? "+SHIFT" : "SHIFT";
    if ((CTRL & mask) == CTRL)
      r += (r.length() > 0) ? "+CTRL" : "CTRL";
    if ((META & mask) == META)
      r += (r.length() > 0) ? "+META" : "META";
    if ((ALT_GRAPH & mask) == ALT_GRAPH)
      r += (r.length() > 0) ? "+ALT_GRAPH" : "ALT_GRAPH";
    return r;  
  }
}
