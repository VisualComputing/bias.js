(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.bias = factory());
}(this, (function () { 'use strict';

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

class Shortcut$1 {
  /**
   * Constructs an "empty" shortcut. Same as: {@link #Shortcut(int)} with the integer
   * parameter being NO_NOMODIFIER_MASK.
   */
  constructor({ mask = null, id = null }) {
    this._mask = mask || NO_MODIFIER_MASK;
    this._id = id || NO_ID;

    this.matches = this.matches.bind(this);
  }
  /**
   * Returns the shortcut's modifiers mask.
   */
  modifiers() {
    return this._mask;
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
const NO_ID = 0;
const NO_MODIFIER_MASK = 0;
const SHIFT            = 0b1;
const CTRL             = 0b10;
const META             = 0b100;
const ALT              = 0b1000;
const ALT_GRAPH        = 0b10000;

class Event {
  constructor({ modifiers = null, id = null, other = null }) {
    this._fire = false;
    this._flush = false;
    /**
     * Constructs an event with an "empty" {@link Shortcut}.
     */
    this._modifiers = NO_MODIFIER_MASK;
    this._id = NO_ID;
    this._timestamp = window.performance.now();

    /**
     * Constructs an event taking the given {@code modifiers} as a
     * {@link Shortcut}.
     */
    if (modifiers !== null && id !== null) {
      this._modifiers = modifiers;
      this._id = id;
      this._timestamp = window.performance.now();
    } else if (other !== null) {
      this._modifiers = other._modifiers;
      this._id = other._id;
      this._timestamp = window.performance.now();
      this._fire = other._fire;
      this._flush = other._flush;
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
    return new Shortcut$1({ mask: this.modifiers(), id: this.id() });
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
   * Only {@link remixlab.bias.event.MotionEvent}s may be null.
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

/**
 * A {@link remixlab.bias.event.MotionEvent} with one degree of freedom ( {@link #x()}).
 */
class DOF1Event extends MotionEvent {
  /**
   * Construct an absolute DOF1 event.
   *
   * @param dx        1-dof
   * @param x         1-dof
   * @param prevEvent
   * @param modifiers MotionShortcut modifiers
   * @param id        MotionShortcut gesture-id
   */
  constructor({ x = 0, dx = 0, modifiers = null, id = null, prevEvent = null, other = null }) {
    if (other) {
      super({ other });
      this._x = other.x;
      this._dx = other.dx;
    } else if (prevEvent !== null) {
      super({ modifiers, id });
      this.setPreviousEvent(prevEvent);
      this._x = x;
      this._dx = x;
    } else if (dx !== null && modifiers !== null && id !== null) {
      super({ modifiers, id });
      this._x = x;
      this.dx = dx;
    } else {
      super();
      this._x = x;
      this.dx = dx;
    }
  }

  get() {
    return new DOF1Event(this);
  }

  flush() {
    super.flush();
  }

  fire() {
    super.fire();
  }

  setPreviousEvent(prevEvent) {
    this._rel = true;
    if (prevEvent != null) {
      if (prevEvent instanceof DOF1Event && prevEvent.id() === this.id()) {
        this._dx = this.x() - prevEvent.x();
        this._distance = this.x() - prevEvent.x();
        this._delay = this.timestamp() - prevEvent.timestamp();
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
  prevX() {
    return this._x() - this._dx();
  }

  modulate(sens = null) {
    if (sens != null) {
      if (sens.length >= 1 && this.isAbsolute()) {
        this._dx *= sens[0];
      }
    }
  }

  isNull() {
    if (this.dx() === 0) return true;
    return false;
  }
}

/**
 * A {@link remixlab.bias.event.MotionEvent} with two degrees-of-freedom ( {@link #x()}
 * and {@link #y()}).
 */
class DOF2Event extends MotionEvent {
  /**
   * Construct an absolute event from the given dof's and modifiers.
   *
   * @param x
   * @param y
   * @param dx
   * @param dy
   * @param modifiers
   * @param id
   */
  constructor({
    x = 0,
    y = 0,
    dx = 0,
    dy = 0,
    modifiers = null,
    id = null,
    prevEvent = null,
    other = null }) {
    if (other) {
      super({ other });
      this._x = other.x;
      this._dx = other.dx;
      this._y = other.y;
      this._dy = other.dy;
    } else if (prevEvent !== null) {
      super({ modifiers, id });
      this.setPreviousEvent(prevEvent);
      this._x = x;
      this._y = y;
      this._dx = dx;
      this._dy = dy;
    } else if (dx !== null && dy !== null && modifiers !== null && id !== null) {
      super({ modifiers, id });
      this._x = x;
      this._y = y;
      this._dx = dx;
      this._dy = dy;
    } else {
      super();
      this._x = x;
      this._y = y;
      this._dx = dx;
      this._dy = dy;
    }
  }

  get() {
    return new DOF2Event(this);
  }

  flush() {
    super.flush();
  }

  fire() {
    super.fire();
  }

  setPreviousEvent(prevEvent) {
    this._rel = true;
    if (prevEvent != null) {
      if (prevEvent instanceof DOF2Event && prevEvent.id() === this.id()) {
        this._dx = this.x() - prevEvent.x();
        this._dy = this.y() - prevEvent.y();
        this._distance = MotionEvent.distance(this._x, this._y, prevEvent.x(), prevEvent.y());
        this._delay = this.timestamp() - prevEvent.timestamp();
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
  prevX() {
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
  prevY() {
    return this.y() - this.dy();
  }

  modulate(sens) {
    if (sens !== null) {
      if (sens.length >= 2 && this.isAbsolute()) {
        this._dx = this._dx * sens[0];
        this._dy = this._dy * sens[1];
      }
    }
  }

  isNull() {
    if (this.dx() === 0 && this.dy() === 0) return true;
    return false;
  }

  /**
   * Reduces the event to a {@link remixlab.bias.event.DOF1Event} (lossy reduction).
   *
   * @param fromX if true keeps dof-1, else keeps dof-2
   */
  dof1Event(fromX = true) {
    let pe1;
    let e1;
    if (fromX) {
      if (this.isRelative()) {
        pe1 = new DOF1Event(null, this.prevX(), this.modifiers(), this.id());
        e1 = new DOF1Event(pe1, this.x(), this.modifiers(), this.id());
      } else {
        e1 = new DOF1Event(this.dx(), this.modifiers(), this.id());
      }
    } else if (this.isRelative()) {
      pe1 = new DOF1Event(null, this.prevY(), this.modifiers(), this.id());
      e1 = new DOF1Event(pe1, this.y(), this.modifiers(), this.id());
    } else {
      e1 = new DOF1Event(this.dy(), this.modifiers(), this.id());
    }
    e1._delay = this.delay();
    e1._speed = this.speed();
    e1._distance = this.distance();
    if (this.fired()) return e1.fire();
    else if (this.flushed()) return e1.flush();
    return e1;
  }
}

/**
 * A {@link remixlab.bias.event.MotionEvent} with three degrees-of-freedom ( {@link #x()},
 * {@link #y()} and {@link #z()} ).
 */
class DOF3Event extends MotionEvent {

  constructor({
    x = 0,
    y = 0,
    z = 0,
    dx = 0,
    dy = 0,
    dz = 0,
    modifiers = null,
    id = null,
    prevEvent = null,
    other = null }) {
    if (other) {
      super({ other });
      this._x = other.x;
      this._dx = other.dx;
      this._y = other.y;
      this._dy = other.dy;
      this._z = other.z;
      this._dz = other.dz;
    } else if (prevEvent !== null) {
      super({ modifiers, id });
      this.setPreviousEvent(prevEvent);
      this._x = x;
      this._y = y;
      this._z = z;
      this._dx = dx;
      this._dy = dy;
      this._dz = dz;
    } else if (dx !== null && dy !== null && dz !== null && modifiers !== null && id !== null) {
      super({ modifiers, id });
      this._x = x;
      this._y = y;
      this._z = z;
      this._dx = dx;
      this._dy = dy;
      this._dz = dz;
    } else {
      super();
      this._x = x;
      this._y = y;
      this._z = z;
      this._dx = dx;
      this._dy = dy;
      this._dz = dz;
    }
  }

  get() {
    return new DOF3Event({ other:this });
  }

  flush() {
    super.flush();
  }

  fire() {
    super.fire();
  }

  setPreviousEvent(prevEvent) {
    this._rel = true;
    if (prevEvent != null) {
      if (prevEvent instanceof DOF3Event && prevEvent.id() === this.id()) {
        this._dx = this.x() - prevEvent.x();
        this._dy = this.y() - prevEvent.y();
        this._dz = this.z() - prevEvent.z();
        this._distance = MotionEvent.distance(
            this._x, this._y, this._z,
            prevEvent.x(), prevEvent.y(), prevEvent.z());
        this._delay = this.timestamp() - prevEvent.timestamp();
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
  prevX() {
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
  prevY() {
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
  prevZ() {
    return this.z() - this.dz();
  }

  modulate(sens) {
    if (sens !== null) {
      if (sens.length >= 3 && this.isAbsolute()) {
        this._dx = this._dx * sens[0];
        this._dy = this._dy * sens[1];
        this._dz = this._dz * sens[2];
      }
    }
  }

  isNull() {
    if (this.dx() === 0 && this.dy() === 0 && this.dz() === 0) return true;
    return false;
  }

  /**
   * Reduces the event to a {@link remixlab.bias.event.DOF2Event} (lossy reduction). Keeps
   * dof-1 and dof-2 and discards dof-3.
   */
  dof2Event() {
    let pe2;
    let e2;
    if (this.isRelative()) {
      pe2 = new DOF2Event(null, this.prevX(), this.prevY(), this.modifiers(), this.id());
      e2 = new DOF2Event(pe2, this.x(), this.y(), this.modifiers(), this.id());
    } else {
      e2 = new DOF2Event(this.dx(), this.dy(), this.modifiers(), this.id());
    }
    e2._delay = this.delay();
    e2._speed = this.speed();
    e2._distance = this.distance();
    if (this.fired()) return e2.fire();
    else if (this.flushed()) return e2.flush();
    return e2;
  }
}

/**
 * A {@link remixlab.bias.event.MotionEvent} with six degrees-of-freedom ( {@link #x()},
 * {@link #y()}, {@link #z()} , {@link #rx()}, {@link #ry()} and {@link #rz()}).
 */
class DOF6Event extends MotionEvent {
  constructor({
    x = 0,
    y = 0,
    z = 0,
    dx = 0,
    dy = 0,
    dz = 0,
    rx = 0,
    ry = 0,
    rz = 0,
    drx = 0,
    dry = 0,
    drz = 0,
    modifiers = null,
    id = null,
    prevEvent = null,
    other = null }) {
    if (other) {
      super({ other });
      this._x = other.x;
      this._dx = other.dx;
      this._y = other.y;
      this._dy = other.dy;
      this._z = other.z;
      this._dz = other.dz;
      this._rx = other.rx;
      this._drx = other.drx;
      this._ry = other.ry;
      this._dry = other.dry;
      this._rz = other.rz;
      this._drz = other.drz;
    } else if (prevEvent !== null) {
      super({ modifiers, id });
      this.setPreviousEvent(prevEvent);
      this._x = x;
      this._y = y;
      this._z = z;
      this._dx = dx;
      this._dy = dy;
      this._dz = dz;
      this._rx = rx;
      this._ry = ry;
      this._rz = rz;
      this._drx = drx;
      this._dry = dry;
      this._drz = drz;
    } else if (
      dx !== null && dy !== null && dz !== null &&
      drx !== null && dry !== null && drz !== null &&
      modifiers !== null && id !== null) {
      super({ modifiers, id });
      this._x = x;
      this._y = y;
      this._z = z;
      this._dx = dx;
      this._dy = dy;
      this._dz = dz;
      this._rx = rx;
      this._ry = ry;
      this._rz = rz;
      this._drx = drx;
      this._dry = dry;
      this._drz = drz;
    } else {
      super();
      this._x = x;
      this._y = y;
      this._z = z;
      this._dx = dx;
      this._dy = dy;
      this._dz = dz;
      this._rx = rx;
      this._ry = ry;
      this._rz = rz;
      this._drx = drx;
      this._dry = dry;
      this._drz = drz;
    }
  }

  get() {
    return new DOF6Event({ other: this });
  }

  flush() {
    super.flush();
  }

  fire() {
    super.fire();
  }

  setPreviousEvent(prevEvent) {
    this._rel = true;
    if (prevEvent != null) {
      if (prevEvent instanceof DOF6Event && prevEvent.id() === this.id()) {
        this._dx = this.x() - prevEvent.x();
        this._dy = this.y() - prevEvent.y();
        this._dz = this.z() - prevEvent.z();
        this._distance = MotionEvent.distance(
            this._x, this._y, this._z,
            this._rx, this._ry, this._rz,
            prevEvent.x(), prevEvent.y(), prevEvent.z(),
            prevEvent.rx(), prevEvent.ry(), prevEvent.rz());
        this._delay = this.timestamp() - prevEvent.timestamp();
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
  prevX() {
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
  prevY() {
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
  prevZ() {
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
  prevRX() {
    return this._rx() - this._drx();
  }

  /**
   * @return previous dof5, only meaningful if the event {@link #isRelative()}
   */
  prevRY() {
    return this._ry() - this._dry();
  }

  /**
   * @return previous dof6, only meaningful if the event {@link #isRelative()}
   */
  prevRZ() {
    return this._rz() - this._drz();
  }

  modulate(sens) {
    if (sens !== null) {
      if (sens.length >= 6 && this.isAbsolute()) {
        this._dx *= sens[0];
        this._dy *= sens[1];
        this._dz *= sens[2];
        this._drx *= sens[3];
        this._dry *= sens[4];
        this._drz *= sens[5];
      }
    }
  }

  isNull() {
    if (
      this.dx() === 0 && this.dy() === 0 && this.dz() === 0 &&
      this.drx() === 0 && this.dry() === 0 && this.drz() === 0
    ) return true;
    return false;
  }

  /**
   * Reduces the event to a {@link remixlab.bias.event.DOF3Event} (lossy reduction).
   *
   * @param fromTranslation if true keeps dof1, dof2 and dof3; otherwise keeps dof4, dof4 and dof6.
   */
  dof3Event(fromTranslation = true) {
    let pe3;
    let e3;
    if (this.isRelative()) {
      if (fromTranslation) {
        pe3 = new DOF3Event(
          null, this.prevX(), this.prevY(), this.prevZ(), this.modifiers(), this.id());
        e3 = new DOF3Event(pe3, this.x(), this.y(), this.z(), this.modifiers(), this.id());
      } else {
        pe3 = new DOF3Event(
          null, this.prevRX(), this.prevRY(), this.prevRZ(), this.modifiers(), this.id());
        e3 = new DOF3Event(this.pe3, this.rx(), this.ry(), this.rz(), this.modifiers(), this.id());
      }
    } else if (fromTranslation) {
      e3 = new DOF3Event(this.dx(), this.dy(), this.dz(), this.modifiers(), this.id());
    } else {
      e3 = new DOF3Event(this.drx(), this.dry(), this.drz(), this.modifiers(), this.id());
    }
    e3._delay = this.delay();
    e3._speed = this.speed();
    e3._distance = this.distance();
    if (this.fired()) return e3.fire();
    else if (this.flushed()) return e3.flush();
    return e3;
  }
}

/**
 * Base class of all DOF_n_Events: {@link Event}s defined from
 * DOFs (degrees-of-freedom).
 * <p>
 * MotionEvents may be relative or absolute (see {@link #isRelative()}, {@link #isAbsolute()})
 * depending whether or not they're constructed from a previous MotionEvent. While
 * relative motion events have {@link #distance()}, {@link #speed()}, and
 * {@link #delay()}, absolute motion events don't.
 */
class MotionEvent extends Event {
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
    this._rel = false;
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

class EventGrabberTuple {

  /**
   * Constructs a {@link Event},
   * {@link Grabber} tuple.
   *
   * @param event {@link Event}
   * @param grabber {@link Grabber}
   */
  constructor(event, grabber) {
    this._event = event;
    this._grabber = grabber;
  }

  /**
   * Calls {@link Grabber#performInteraction(Event)}.
   *
   * @return true if succeeded and false otherwise.
   */
  perform() {
    if (this._grabber === null || this._event === null) {
      return false;
    }
    this._grabber.performInteraction(event);
    return true;
  }

  /**
   * Returns the event from the tuple.
   */
  event() {
    return this._event;
  }

  /**
   * Returns the object Grabber in the tuple.
   */
  grabber() {
    return this._grabber;
  }
}

/**
 * Agents gather data from different sources --mostly from input devices such touch
 * surfaces or simple mice-- and reduce them into a rather simple but quite 'useful' set
 * of interface events ({@link Event} ) for third party objects (
 * {@link Grabber} objects) to consume them (
 * {@link #handle(Event)}). Agents thus effectively open up a channel between all
 * kinds of input data sources and user-space objects. To add/remove a grabber to/from the
 * {@link #grabbers()} collection issue {@link #addGrabber(Grabber)} /
 * {@link #removeGrabber(Grabber)} calls. Derive from this agent and either call
 * {@link #handle(Event)} or override {@link #handleFeed()} .
 * <p>
 * The agent may send events to its {@link #inputGrabber()} which may be regarded as
 * the agent's grabber target. The {@link #inputGrabber()} may be set by querying each
 * grabber object in {@link #grabbers()} to check if its
 * {@link Grabber#checkIfGrabsInput(Event)}) condition is met (see
 * {@link #updateTrackedGrabber(Event)}, {@link #updateTrackedGrabberFeed()}). The
 * first grabber meeting the condition, namely the {@link #trackedGrabber()}), will then
 * be set as the {@link #inputGrabber()}. When no grabber meets the condition, the
 * {@link #trackedGrabber()} is then set to null. In this case, a non-null
 * {@link #inputGrabber()} may still be set with {@link #setDefaultGrabber(Grabber)} (see
 * also {@link #defaultGrabber()}).
 */
class Agent {
  /**
   * Constructs an Agent and registers is at the given inputHandler.
   */
  constructor(inputHandler) {
    this._grabberList = new Set();
    this._trackedGrabber = null;
    this._defaultGrabber = null;
    this._agentTrckn = true;
    this._handler = inputHandler;
    this._handler.registerAgent(this);
  }
  // 1. Grabbers

  /**
   * Removes the grabber from the {@link #grabbers()} list.
   *
   * @see #removeGrabbers()
   * @see #addGrabber(Grabber)
   * @see #hasGrabber(Grabber)
   * @see #grabbers()
   */
  removeGrabber(grabber) {
    if (this.defaultGrabber() === grabber) this.setDefaultGrabber(null);
    if (this.trackedGrabber() === grabber) this.resetTrackedGrabber();
    this._grabberList.delete(grabber);
    return this._grabberList;
  }

  /**
   * Clears the {@link #grabbers()} list.
   *
   * @see #removeGrabber(Grabber)
   * @see #addGrabber(Grabber)
   * @see #hasGrabber(Grabber)
   * @see #grabbers()
   */
  removeGrabbers() {
    this.setDefaultGrabber(null);
    this.resetTrackedGrabber();
    this._grabberList.clear();
  }

  /**
   * Returns the list of grabber (and interactive-grabber) objects handled by this agent.
   *
   * @see #removeGrabber(Grabber)
   * @see #addGrabber(Grabber)
   * @see #hasGrabber(Grabber)
   * @see #removeGrabbers()
   */
  grabbers() {
    return this._grabberList;
  }

  /**
   * Returns true if the grabber is currently in the agents {@link #grabbers()} list.
   *
   * @see #removeGrabber(Grabber)
   * @see #addGrabber(Grabber)
   * @see #grabbers()
   * @see #removeGrabbers()
   */
  hasGrabber(grabber) {
    return this._grabberList.has(grabber);
  }

  /**
   * Adds the grabber in {@link #grabbers()}.
   *
   * @see #removeGrabber(Grabber)
   * @see #hasGrabber(Grabber)
   * @see #grabbers()
   * @see #removeGrabbers()
   */
  addGrabber(grabber) {
    if (grabber !== null || this._grabberList.has(grabber)) return false;
    this._grabberList.add(grabber);
    return true;
  }

  /**
   * Feeds {@link #updateTrackedGrabber(Event)} and {@link #handle(Event)} with
   * the returned event. Returns null by default. Use it in place of
   * {@link #updateTrackedGrabberFeed()} and/or {@link #handleFeed()} which take
   * higher-precedence.
   * <p>
   * Automatically call by the main event loop (
   * {@link InputHandler#handle()}). See ProScene's Space-Navigator
   * example.
   *
   * @see InputHandler#handle()
   * @see #handleFeed()
   * @see #updateTrackedGrabberFeed()
   * @see #handle(Event)
   * @see #updateTrackedGrabber(Event)
   */
  feed() {
    return null;
  }

  /**
   * Feeds {@link #handle(Event)} with the returned event. Returns null by default.
   * Use it in place of {@link #feed()} which takes lower-precedence.
   * <p>
   * Automatically call by the main event loop (
   * {@link InputHandler#handle()}). See ProScene's Space-Navigator
   * example.
   *
   * @see InputHandler#handle()
   * @see #feed()
   * @see #updateTrackedGrabberFeed()
   * @see #handle(Event)
   * @see #updateTrackedGrabber(Event)
   */
  handleFeed() {
    return null;
  }

  /**
   * Feeds {@link #updateTrackedGrabber(Event)} with the returned event. Returns null
   * by default. Use it in place of {@link #feed()} which takes lower-precedence.
   * <p>
   * Automatically call by the main event loop (
   * {@link InputHandler#handle()}).
   *
   * @see InputHandler#handle()
   * @see #feed()
   * @see #handleFeed()
   * @see #handle(Event)
   * @see #updateTrackedGrabber(Event)
   */
  updateTrackedGrabberFeed() {
    return null;
  }

  /**
   * Returns the {@link InputHandler} this agent is registered to.
   */
  inputHandler() {
    return this._handler;
  }

  /**
   * If {@link #isTracking()} and the agent is registered at the {@link #inputHandler()}
   * then queries each object in the {@link #grabbers()} to check if the
   * {@link Grabber#checkIfGrabsInput(Event)}) condition is met.
   * The first object meeting the condition will be set as the {@link #inputGrabber()} and
   * returned. Note that a null grabber means that no object in the {@link #grabbers()}
   * met the condition. A {@link #inputGrabber()} may also be enforced simply with
   * {@link #setDefaultGrabber(Grabber)}.
   *
   * @param event to query the {@link #grabbers()}
   * @return the new grabber which may be null.
   * @see #setDefaultGrabber(Grabber)
   * @see #isTracking()
   * @see #handle(Event)
   * @see #trackedGrabber()
   * @see #defaultGrabber()
   * @see #inputGrabber()
   */
  updateTrackedGrabber(event) {
    if (
      event == null ||
      !this.inputHandler().isAgentRegistered(this) ||
      !this.isTracking()
    ) {
      return this.trackedGrabber();
    }
    // We first check if default grabber is tracked,
    // i.e., default grabber has the highest priority (which is good for
    // keyboards and doesn't hurt motion grabbers:
    const dG = this.defaultGrabber();
    if (dG != null) {
      if (dG.checkIfGrabsInput(event)) {
        this._trackedGrabber = dG;
        return this.trackedGrabber();
      }
    }
    // then if tracked grabber remains the matches:
    const tG = this.trackedGrabber();
    if (tG != null) {
      if (tG.checkIfGrabsInput(event)) return this.trackedGrabber();
    }
    // pick the first otherwise
    this._trackedGrabber = null;
    for (const grabber of this._grabberList) {
      if (grabber !== dG && grabber !== tG) {
        if (grabber.checkIfGrabsInput(event)) {
          this._trackedGrabber = grabber;
          break;
        }
      }
    }
    return this.trackedGrabber();
  }

  /**
   * Returns the sensitivities used in {@link #handle(Event)} to
   * {@link remixlab.bias.event.MotionEvent#modulate(float[])}.
   */
  sensitivities(event) {
    return [1, 1, 1, 1, 1, 1];
  }

  /**
   * Enqueues an EventGrabberTuple(event, inputGrabber()) on the
   * {@link InputHandler#eventTupleQueue()}, thus enabling a call on
   * the {@link #inputGrabber()}
   * {@link Grabber#performInteraction(Event)} method (which is
   * scheduled for execution till the end of this main event loop iteration, see
   * {@link InputHandler#enqueueEventTuple(EventGrabberTuple)} for
   * details).
   *
   * @see #inputGrabber()
   * @see #updateTrackedGrabber(Event)
   */
  handle(event) {
    if (
      event === null ||
      this._inputHandler() === null ||
      !this._handler.isAgentRegistered(this)
    ) {
      return false;
    }
    if (
      event instanceof MotionEvent &&
      event.isAbsolute() &&
      event.isNull() &&
      !event.flushed()
    ) {
      return false;
    }
    if (event instanceof MotionEvent) {
      event.modulate(this.sensitivities(event));
    }
    const inputGrabber = this.inputGrabber();
    if (inputGrabber != null) {
      return this.inputHandler().enqueueEventTuple(
        new EventGrabberTuple(event, inputGrabber)
      );
    }
    return false;
  }

  /**
   * If {@link #trackedGrabber()} is non null, returns it. Otherwise returns the
   * {@link #defaultGrabber()}.
   *
   * @see #trackedGrabber()
   */
  inputGrabber() {
    return this.trackedGrabber() || this.defaultGrabber();
  }

  /**
   * Returns true if {@code g} is the agent's {@link #inputGrabber()} and false otherwise.
   */
  isInputGrabber(grabber) {
    return this.inputGrabber() === grabber;
  }

  /**
   * Returns {@code true} if this agent is tracking its grabbers.
   * <p>
   * You may need to {@link #enableTracking()} first.
   */
  isTracking() {
    return this._agentTrckn;
  }

  /**
   * Enables tracking so that the {@link #inputGrabber()} may be updated when calling
   * {@link #updateTrackedGrabber(Event)}.
   *
   * @see #disableTracking()
   */
  enableTracking() {
    this.setTracking(true);
  }

  /**
   * Disables tracking.
   *
   * @see #enableTracking()
   */
  disableTracking() {
    this.setTracking(false);
  }

  /**
   * Sets the {@link #isTracking()} value.
   */
  setTracking(enable) {
    this._agentTrckn = enable;
    if (!this.isTracking()) {
      this._trackedGrabber = null;
    }
  }

  /**
   * Calls {@link #setTracking(boolean)} to toggle the {@link #isTracking()} value.
   */
  toggleTracking() {
    this.setTracking(!this.isTracking());
  }

  /**
   * Returns the grabber set after {@link #updateTrackedGrabber(Event)} is called. It
   * may be null.
   */
  trackedGrabber() {
    return this._trackedGrabber;
  }

  /**
   * Default {@link #inputGrabber()} returned when {@link #trackedGrabber()} is null and
   * set with {@link #setDefaultGrabber(Grabber)}.
   *
   * @see #inputGrabber()
   * @see #trackedGrabber()
   */
  defaultGrabber() {
    return this._defaultGrabber;
  }

  /**
   * Same as
   * {@code defaultGrabber() != g1 ? setDefaultGrabber(g1) ? true : setDefaultGrabber(g2) : setDefaultGrabber(g2)}
   * which is ubiquitous among the examples.
   */
  shiftDefaultGrabber(g1, g2) {
    return this.defaultGrabber() != g1
      ? this.setDefaultGrabber(g1) ? true : this.setDefaultGrabber(g2)
      : this.setDefaultGrabber(g2);
  }

  /**
   * Sets the {@link #defaultGrabber()}
   * <p>
   * {@link #inputGrabber()}
   */
  setDefaultGrabber(grabber) {
    if (grabber == null) {
      this._defaultGrabber = null;
      return true;
    }
    if (!this.hasGrabber(grabber)) {
      console.warn(
        "To set an Agent default grabber the Grabber should be added into agent first."
      );
      return false;
    }
    this._defaultGrabber = grabber;
    return true;
  }

  /**
   * Sets the {@link #trackedGrabber()} to {@code null}.
   */
  resetTrackedGrabber() {
    this._trackedGrabber = null;
  }
}

class ClickShortcut extends Shortcut {
  /**
   * Defines a click shortcut from the given gesture-id, modifier mask, and number of
   * clicks.
   *
   * @param m  modifier mask
   * @param id id
   * @param c  bumber of clicks
   */
  constructor({ modifiers = NO_MODIFIER_MASk, id = null, clicks = 1 }) {
    super(modifiers, id);
    this._numberOfClicks = 1;
    if (clicks <= 0) this._numberOfClicks = 1;
    else this._numberOfClicks = clicks;
  }

  /**
   * Returns the click-shortcut click count.
   */
  clickCount() {
    return this._numberOfClicks;
  }

  matches(other) {
    if (other instanceof ClickShortcut) {
      return super.matches(other) && this.clickCount() === other.clickCount();
    }
    return false;
  }
}

class ClickEvent extends Event {
  constructor({
    x = 0,
    y = 0,
    modifiers = NO_MODIFIER_MASK,
    shortcut,
    clicks = 1,
    other = null }) {
    super({ modifiers, id: shortcut, other });
    this._x = x;
    this._y = y;
    this._numberOfClicks = clicks;
    if (other !== null) {
      this._x = other._x;
      this._y = other._y;
      this._numberOfClicks = other._numberOfClicks;
    }
  }

  get() {
    return new ClickEvent({ other: this });
  }

  flush() {
    return super.flush();
  }

  fire() {
    return super.fire();
  }

  shortcut() {
    return new ClickShortcut(this.modifiers(), this.id(), this.clickCount());
  }

  /**
   * @return event x coordinate
   */
  x() {
    return this._x;
  }

  /**
   * @return event y coordinate
   */
  y() {
    return this._y;
  }

  /**
   * @return event number of clicks
   */
  clickCount() {
    return this._numberOfClicks;
  }
}

/**
 * This class represents {@link KeyEvent} shortcuts.
 * <p>
 * Key shortcuts can be of one out of two forms: 1. Characters (e.g., 'a'); 2.
 * Virtual keys (e.g., right arrow key); or, 2. Key combinations (e.g., CTRL key + virtual
 * key representing 'a').
 */
class KeyShortcut extends Shortcut$1 {
  /**
   * Defines a key shortcut from the given character.
   *
   * @param key the character that defines the key shortcut.
   * @param mmodifiers  the mask
   * @param id the virtual key that defines the key shortcut.
   */
  constructor({ key = null, modifiers = null, id = null }) {
    if (key !== null) {
      super();
      this._key = key;
    } else if (modifiers !== null) {
      super({ modifiers, id });
      this._key = '\0';
    } else {
      super({ id });
      this._key = '\0';
    }
  }
  /**
   * Returns the key-shortcut key.
   */
  getKey() {
    return this._key;
  }

  matches(other) {
    if (other instanceof KeyShortcut) {
      return super.matches(other) && this.getKey() === other.getKey();
    }
    return false;
  }
}

/**
 * A key-event is an {@link Event} specialization that
 * encapsulates a {@link KeyShortcut}. Key shortcuts may be
 * of one form out of two: 1. A single Character; or, 2. A modifier mask (such as: (ALT |
 * SHIFT)) plus a virtual-key.
 * <p>
 * <b>Note</b> that virtual key codes are used to report which keys have been
 * pressed, rather than a character generated by the combination of one or more keystrokes
 * (such as "A", which comes from shift and "a"). Their values depend on the platform your
 * running your code. In Java, for instance, have a look at
 * <a href= "http://docs.oracle.com/javase/7/docs/api/java/awt/event/KeyEvent.html">
 * KeyEvent</a> to get some VK_* values. Note that Proscene sets them automatically from
 * the platform where the framework is running.
 */
class KeyEvent extends Event {

  /**
   * Constructs a keyevent with <b>c</b> defining its
   * {@link KeyShortcut}.
   */
  constructor({ char = null, modifiers = null, vk = null, other = null }) {
    if (char !== null) {
      super();
      this._key = char;
    } else if (modifiers !== null && vk !== null) {
      super({ modifiers, id: vk });
      this._key = '\0';
    } else if (vk !== null && modifiers === null) {
      super({ id: vk });
      this._key = '\0';
    } else {
      super({ other });
      this._key = other.key();
    }
  }


  get() {
    return new KeyEvent({ other: this });
  }

  flush() {
    return super.flush();
  }

  fire() {
    return super.fire();
  }

  shortcut() {
    if (this._key === '\0') return new KeyShortcut({ modifiers: this.modifiers(), id: this.id() });
    return new KeyShortcut({ key: this.key() });
  }

  key() {
    return this._key;
  }
}

const event$1 = {
  ClickEvent,
  ClickShortcut,
  DOF1Event,
  DOF2Event,
  DOF3Event,
  DOF6Event,
  KeyEvent,
  KeyShortcut,
  MotionEvent,
};

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
 * Grabbers are means to attach a user-space object to all the
 * {@link Agent}s (see
 * {@link Agent#addGrabber(Grabber)}) through which it's going to be
 * handled. For details, refer to the {@link Agent} documentation.
 */
class Grabber$1 {
  /**
   * Defines the rules to set the grabber as an agent input-grabber.
   *
   * @see Agent#updateTrackedGrabber(Event)
   * @see Agent#inputGrabber()
   */
  checkIfGrabsInput(event){
    throw new TypeError('checkIfGrabsInput must be overrided');
  }

  /**
   * Defines how the grabber should react according to the given event.
   *
   * @see Agent#handle(Event)
   */
  performInteraction(event){
    throw new TypeError('performInteraction must be overrided');
  }
}

/**
 * The InputHandler object is the high level package handler which holds a collection of
 * {@link #agents()}, and an event dispatcher queue of
 * {@link EventGrabberTuple}s ({@link #eventTupleQueue()}). Such tuple
 * represents a message passing to application objects, allowing an object to be
 * instructed to perform a particular user-defined action from a given
 * {@link Event}. For an introduction to BIAS please refer to
 * <a href="http://nakednous.github.io/projects/bias">this</a>.
 * <p>
 * At runtime, the input handler should continuously run the two loops defined in
 * {@link #handle()}. Therefore, simply attach a call to {@link #handle()} at the end of
 * your main event (drawing) loop for that to take effect (like it's done in
 * <b>dandelion</b> by the <b>AbstractScene.postDraw()</b> method).
 */
class InputHandler {
  constructor() {
    // D E V I C E S & E V E N T S
    this._agents = new Set();
    this._eventTupleQueue = new Set();
  }

  /**
   * Main handler method. Call it at the end of your main event (drawing) loop (like it's
   * done in <b>dandelion</b> by the <b>AbstractScene.postDraw()</b> method)
   * <p>
   * The handle comprises the following two loops:
   * <p>
   * 1. {@link EventGrabberTuple} producer loop which for each
   * registered agent calls: a.
   * {@link Agent#updateTrackedGrabber(Event)}; and, b.
   * {@link Agent#handle(Event)}. Note that the event are
   * obtained from the agents callback
   * {@link Agent#updateTrackedGrabberFeed()} and
   * {@link Agent#handleFeed()} methods, respectively. The event
   * may also be obtained from {@link Agent#handleFeed()} which may
   * replace both of the previous feeds when they are null.<br>
   * 2. User-defined action consumer loop: which for each
   * {@link EventGrabberTuple} calls
   * {@link EventGrabberTuple#perform()}.<br>
   *
   * @see Agent#feed()
   * @see Agent#updateTrackedGrabberFeed()
   * @see Agent#handleFeed()
   */
  handle() {
    // 1. Agents
    for (const agent of this._agents) {
      agent.updateTrackedGrabber(
        agent.updateTrackedGrabberFeed() != null
          ? agent.updateTrackedGrabberFeed()
          : agent.feed());
      agent.handle(
        agent.handleFeed() != null ? agent.handleFeed() : agent.feed());
    }
    while (!this._eventTupleQueue.length > 0) {
      const eventTupleArray = Array.from(this._eventTupleQueue);
      const eventTuple = eventTupleQueue.shift();
      eventTuple.perform();
      this._eventTupleQueue = Set(eventTupleArray);
    }
  }

  /**
   * Calls {@link Agent#addGrabber(Grabber)} on registered
   * {@link #agents()}.
   */
  addGrabber(grabber) {
    for (const agent of this._agents) {
      agent.addGrabber(grabber);
    }
  }

  /**
   * Calls {@link Agent#removeGrabber(Grabber)} on registered
   * {@link #agents()}.
   */
  removeGrabber(grabber) {
    for (const agent of this._agents) {
      agent.removeGrabber(grabber);
    }
  }

  /**
   * Calls {@link Agent#removeGrabbers()} on registered
   * {@link #agents()}.
   */
  removeGrabbers() {
    for (const agent of this._agents) {
      agent.removeGrabbers();
    }
  }

  /**
   * Calls {@link Agent#setDefaultGrabber(Grabber)} on registered
   * {@link #agents()}.
   */
  setDefaultGrabber(grabber) {
    for (const agent of this._agents) {
      agent.setDefaultGrabber(grabber);
    }
  }

  /**
   * Calls {@link Agent#shiftDefaultGrabber(Grabber, Grabber)} on
   * registered {@link #agents()}.
   */
  shiftDefaultGrabber(g1, g2) {
    for (const agent of this._agents) {
      agent.shiftDefaultGrabber(g1, g2);
    }
  }

  /**
   * Returns {@code true} if {@link Agent#isInputGrabber(Grabber)} is
   * {@code true} for at least one agent in {@link #agents()}.
   */
  isInputGrabber(grabber) {
    for (const agent of this._agents) {
      if (agent.isInputGrabber(grabber)) return true;
    }
    return false;
  }

  /**
   * Returns {@code true} if {@link Agent#hasGrabber(Grabber)} is
   * {@code true} for at least one agent in {@link #agents()}.
   */
  hasGrabber(grabber) {
    for (const agent of this._agents) {
      if (agent.hasGrabber(grabber)) return true;
    }
    return false;
  }

  /**
   * Calls {@link Agent#resetTrackedGrabber()} on registered
   * {@link #agents()}.
   */
  resetTrackedGrabber() {
    for (const agent of this._agents) {
      agent.resetTrackedGrabber(g1, g2);
    }
  }

  /**
   * Returns a list of the registered agents.
   */
  agents() {
    return this._agents;
  }

  /**
   * Registers the given agent.
   */
  registerAgent(agent) {
    this._agents.add(agent);
  }

  /**
   * Returns true if the given agent is registered.
   */
  isAgentRegistered(agent) {
    this._agents.has(agent);
  }

  /**
   * Unregisters the given agent.
   */
  unregisterAgent(agent) {
    this._agents.delete(agent);
  }

  /**
   * Unregisters all agents from the handler.
   */
  unregisterAgents() {
    this._agents.clear();
  }

  /**
   * Returns the event tuple queue. Rarely needed.
   */
  eventTupleQueue() {
    return this._eventTupleQueue;
  }

  /**
   * Enqueues the eventTuple for later execution which happens at the end of
   * {@link #handle()}. Returns {@code true} if succeeded and {@code false} otherwise.
   *
   * @see #handle()
   */
  enqueueEventTuple(eventTuple) {
    this._eventTupleQueue.add(eventTuple);
  }

  /**
   * Removes the given event from the event queue. No action is executed.
   *
   * @param event to be removed.
   */
  removeEventTuple(event) {
    this._eventTupleQueue.delete(event);
  }

  /**
   * Clears the event queue. Nothing is executed.
   */
  removeEventTuples() {
    this._eventTupleQueue.clear();
  }
}

class GrabberObject extends Grabber {
  /**
   * Check if this object is the {@link Agent#inputGrabber()} . Returns
   * {@code true} if this object grabs the agent and {@code false} otherwise.
   */
  constructor(agentOrInputHandler) {
    super();
    if (agentOrInputHandler !== null) agentOrInputHandler.addGrabber(this);
  }

  /**
   * Checks if the frame grabs input from any agent registered at the given input handler or agent.
   */
  static grabsInput(agentOrInputHandler) {
    if (agentOrInputHandler instanceof Agent){
      return agentOrInputHandler.inputGrabber() === this;
    }
    if (agentOrInputHandler instanceof InputHandler) {
      for (let agent of agentOrInputHandler) {
        if (agentOrInputHandler.inputGrabber() === this) return true;
      }
    }
    return false;
  }

  performInteraction(event) {
    if (event instanceof KeyEvent) this.performInteractionKey(event);
    if (event instanceof ClickEvent) this.performInteractionClick(event);
    if (event instanceof MotionEvent) this.performInteractionMotion(event);
  }

  /**
   * Calls performInteraction() on the proper motion event:
   * {@link remixlab.bias.event.DOF1Event}, {@link remixlab.bias.event.DOF2Event},
   * {@link remixlab.bias.event.DOF3Event} or {@link remixlab.bias.event.DOF6Event}.
   * <p>
   * Override this method when you want the object to perform an interaction from a
   * {@link remixlab.bias.event.MotionEvent}.
   */
  performInteractionMotion(event) {
    if (event instanceof DOF1Event) this.performInteractionDOF1(event);
    if (event instanceof DOF2Event) this.performInteractionDOF2(event);
    if (event instanceof DOF3Event) this.performInteractionDOF3(event);
    if (event instanceof DOF6Event) this.performInteractionDOF6(event);
  }

  /**
   * Override this method when you want the object to perform an interaction from a
   * {@link KeyEvent}.
   */
  performInteractionKey(event) {
  }

  /**
   * Override this method when you want the object to perform an interaction from a
   * {@link remixlab.bias.event.ClickEvent}.
   */
  performInteractionClick(event) {
  }

  /**
   * Override this method when you want the object to perform an interaction from a
   * {@link remixlab.bias.event.DOF1Event}.
   */
  performInteractionDOF1(event) {
  }

  /**
   * Override this method when you want the object to perform an interaction from a
   * {@link remixlab.bias.event.DOF2Event}.
   */
  performInteractionDOF2(event) {
  }

  /**
   * Override this method when you want the object to perform an interaction from a
   * {@link remixlab.bias.event.DOF3Event}.
   */
  performInteractionDOF3(event) {
  }

  /**
   * Override this method when you want the object to perform an interaction from a
   * {@link remixlab.bias.event.DOF6Event}.
   */
  performInteractionDOF6(event) {
  }

  checkIfGrabsInput(event) {
    if (event instanceof KeyEvent) return this.checkIfGrabsInputKey(event);
    if (event instanceof ClickEvent) return this.checkIfGrabsInputClick(event);
    if (event instanceof MotionEvent) return this.checkIfGrabsInputMotion(event);
    return false;
  }

  /**
   * Calls checkIfGrabsInput() on the proper motion event:
   * {@link remixlab.bias.event.DOF1Event}, {@link remixlab.bias.event.DOF2Event},
   * {@link remixlab.bias.event.DOF3Event} or {@link remixlab.bias.event.DOF6Event}.
   * <p>
   * Override this method when you want the object to be picked from a
   * {@link KeyEvent}.
   */
  checkIfGrabsInputMotion(event) {
    if (event instanceof DOF1Event) return this.checkIfGrabsInputDOF1(event);
    if (event instanceof DOF2Event) return this.checkIfGrabsInputDOF2(event);
    if (event instanceof DOF3Event) return this.checkIfGrabsInputDOF3(event);
    if (event instanceof DOF6Event) return this.checkIfGrabsInputDOF6(event);
    return false;
  }

  /**
   * Override this method when you want the object to be picked from a
   * {@link KeyEvent}.
   */
  checkIfGrabsInputKey(event) {
    return false;
  }

  /**
   * Override this method when you want the object to be picked from a
   * {@link remixlab.bias.event.ClickEvent}.
   */
  checkIfGrabsInputClick(event) {
    return false;
  }

  /**
   * Override this method when you want the object to be picked from a
   * {@link remixlab.bias.event.DOF1Event}.
   */
  checkIfGrabsInputDOF1(event) {
    return false;
  }

  /**
   * Override this method when you want the object to be picked from a
   * {@link remixlab.bias.event.DOF2Event}.
   */
  checkIfGrabsInputDOF2(event) {
    return false;
  }

  /**
   * Override this method when you want the object to be picked from a
   * {@link remixlab.bias.event.DOF3Event}.
   */
  checkIfGrabsInputDOF3(event) {
    return false;
  }

  /**
   * Override this method when you want the object to be picked from a
   * {@link remixlab.bias.event.DOF6Event}.
   */
  checkIfGrabsInputDOF6(event) {
    return false;
  }
}

/**
 */
const bias = {
  Agent,
  Event,
  event: event$1,
  EventGrabberTuple,
  Grabber: Grabber$1,
  GrabberObject,
  InputHandler,
  Shortcut: Shortcut$1,
};

return bias;

})));
