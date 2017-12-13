/**
 * The root of all events that are to be handled by an {@link Agent}.
 * Every Event encapsulates a {@link Shortcut}. Gesture initialization and
 * termination, which may be of the interest of {@link Grabber}
 * objects, are reported by {@link #fired()} and {@link #flushed()}, respectively.
 * <p>
 * The following are the main class specializations:
 * {@link remixlab.input.event.MotionEvent}, {@link TapEvent}, and
 * {@link remixlab.input.event.KeyEvent}. Please refer to their documentation for
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
 * non-default inputGrabber hardware).
 */
import Shortcut from './Shortcut';

export const NO_ID = 0;
export const NO_MODIFIER_MASK = 0;
export const SHIFT            = 0b1;
export const CTRL             = 0b10;
export const META             = 0b100;
export const ALT              = 0b1000;
export const ALT_GRAPH        = 0b10000;

export default class Event {
  constructor({ modifiers = NO_MODIFIER_MASK, id = NO_ID, other = null } = {}) {
    if (other !== null) {
      this._modifiers = other._modifiers;
      this._id = other._id;
      this._timestamp = window.performance.now();
      this._fire = other._fire;
      this._flush = other._flush;
    } else {
      this._fire = false;
      this._flush = false;
      this._modifiers = modifiers;
      this._id = id;
      this._timestamp = window.performance.now();
    }
  }

  get() {
    return new Event({ other: this });
  }

  /**
   * Same as {@code this.get()} but sets the {@link #flushed()} flag to true. Only agents
   * may call this.
   *
   * @see #flushed()
   */
  flush() {
    if (this._fire || this._flush) {
      console.warn(`Warning: event already ${this._fire ? 'fired' : 'flushed'}`);
      return this;
    }
    const event = this.get();
    event._flush = true;
    return event;
  }

  /**
   * Same as {@code this.get()} but sets the {@link #fired()} flag to true. Only agents
   * may call this.
   *
   * @see #flushed()
   */
  fire() {
    if (this._fire || this._flush) {
      console.warn(`Warning: event already ${this._fire ? 'fired' : 'flushed'}`);
      return this;
    }
    const event = this.get();
    event._fire = true;
    return event;
  }

  /**
   * Returns true if this is a 'flushed' event. Flushed events indicate gesture
   * termination, such as a mouse-release.
   *
   * @see #fired()
   */
  flushed() {
    return this._flush;
  }

  /**
   * Returns true if this is a 'fired' event. Fired events indicate gesture activation,
   * such as a mouse-press.
   *
   * @see #flushed()
   */
  fired() {
    return this._fire;
  }

  /**
   * @return the shortcut encapsulated by this event.
   * @see Shortcut
   */
  shortcut() {
    return new Shortcut(this.id(), this.modifiers());
  }

  /**
   * @return the modifiers defining the event {@link Shortcut}.
   */
  modifiers() {
    return this._modifiers;
  }

  /**
   * Returns the id defining the event's {@link Shortcut}.
   */
  id() {
    return this._id;
  }

  /**
   * @return the time at which the event occurs
   */
  timestamp() {
    return this._timestamp;
  }

  /**
   * Only {@link remixlab.input.event.MotionEvent}s may be null.
   */
  isNull() {
    return false;
  }

  /**
   * @return true if Shift was down when the event occurs
   */
  isShiftDown() {
    return !!(this._modifiers & SHIFT);
  }

  /**
   * @return true if Ctrl was down when the event occurs
   */
  isControlDown() {
    return !!(this._modifiers & CTRL);
  }

  /**
   * @return true if Meta was down when the event occurs
   */
  isMetaDown() {
    return !!(this._modifiers & META);
  }

  /**
   * @return true if Alt was down when the event occurs
   */
  isAltDown() {
    return !!(this._modifiers & ALT);
  }

  /**
   * @return true if AltGraph was down when the event occurs
   */
  isAltGraph() {
    return !!(this._modifiers & ALT_GRAPH);
  }

  /**
   * @param mask of modifiers
   * @return a String listing the event modifiers
   */
  static modifiersText(mask) {
    let r = '';
    if ((ALT & mask) === ALT) r += 'ALT';
    if ((SHIFT & mask) === SHIFT) r += r.length > 0 ? '+SHIFT' : 'SHIFT';
    if ((CTRL & mask) === CTRL) r += r.length > 0 ? '+CTRL' : 'CTRL';
    if ((META & mask) === META) r += r.length > 0 ? '+META' : 'META';
    if ((ALT_GRAPH & mask) === ALT_GRAPH)
      r += r.length() > 0 ? '+ALT_GRAPH' : 'ALT_GRAPH';
    return r;
  }
}
