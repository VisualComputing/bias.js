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
 * A [{@link Event},{@link Grabber}] tuple. An
 * enqueued tuple fires {@link Grabber#interact(Event)}
 * call from the event in the tuple.
 * <p>
 * Tuples are typically enqueued by an agent (see
 * {@link Agent#handle(Event)}), but may be enqueued manually, see
 * {@link InputHandler#enqueueTuple(Tuple)}.
 */
class Tuple {
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
   * Calls {@link Grabber#interact(Event)}.
   * returns true if succeeded and false otherwise.
   * @return boolean
   */
  interact() {
    if (this._grabber === null || this._event === null) {
      return false;
    }
    this._grabber.interact(this._event);
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
 * Interface is used to check if an Object implements a desired set of behaviors
 * Adapted from {@link http://jscriptpatterns.blogspot.com.co/2013/01/javascript-interfaces.html}
 */

class Interface {
  /**
   * @param methods
   */
  constructor({ name, methods }) {
    this._name = name;
    this._methods = [];

    for (let i = 0, len = methods.length; i < len; i++) {
      if (typeof methods[i] !== 'string') {
        throw new Error("Interface constructor expects method names to be passed in as a string.");
      }
      this._methods.push(methods[i]);
    }
  }

  ensureImplements(object) {
    for (let j = 0, methodsLen = this._methods.length; j < methodsLen; j++) {
      const method = this._methods[j];
      if (!object[method] || typeof object[method] !== 'function') {
        throw new Error("Function Interface.ensureImplements: object does not implement the " + this._name + " interface. Method " + method + " was not found.");
      }
    }
  }
}

const Input = { "Grabber": new Interface( { name: "Grabber", methods: ["track","interact"] }) };

/**
 * Agents gather data from different sources --mostly from input devices such touch
 * surfaces or simple mice-- and reduce them into a rather simple but quite 'useful' set
 * of interface events ({@link Event} ) for third party objects (
 * {@link Grabber} objects) to consume them (
 * {@link #handle(Event)}). Agents thus effectively open up a channel between all
 * kinds of input data sources and user-space objects. To add/removeGrabbers a grabber to/from the
 * {@link #grabbers()} collection issue {@link #addGrabber(Grabber)} /
 * {@link #removeGrabber(Grabber)} calls. Derive from this agent and either call
 * {@link #handle(Event)} or override {@link #handleFeed()} .
 * <p>
 * The agent may send events to its {@link #inputGrabber()} which may be regarded as
 * the agent's grabber target. The {@link #inputGrabber()} may be set by querying each
 * grabber object in {@link #grabbers()} to check if its
 * {@link Grabber#track(Event)}) condition is met (see
 * {@link #poll(Event)}, {@link #pollFeed()}). The
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
  constructor(handler) {
    this._grabberPool = new Set();
    this._trackedGrabber = null;
    this._defaultGrabber = null;
    this._trackingEnabled = false;
    this._handler = handler;
    this.setTracking(true);
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
    return this._grabberPool.delete(grabber);
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
    this._trackedGrabber = null;
    this._grabberPool.clear();
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
    return this._grabberPool;
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
    return this._grabberPool.has(grabber);
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
    if (grabber === null || this._grabberPool.has(grabber)) return false;
    // Check if grabber implements Grabber methods
    Input.Grabber.ensureImplements(grabber);
    this._grabberPool.add(grabber);
    return true;
  }

  /**
   * Feeds {@link #poll(Event)} and {@link #handle(Event)} with
   * the returned event. Returns null by default,
   * i.e., it should be implemented by your Agent derived classes.
   * Use it in place of {@link #pollFeed()} and/or {@link #handleFeed()}
   * which take higher-precedence.
   * <p>
   * Automatically call by the main event loop (
   * {@link InputHandler#handle()}). See ProScene's Space-Navigator
   * example.
   *
   * @see InputHandler#handle()
   * @see #handleFeed()
   * @see #pollFeed()
   * @see #handle(Event)
   * @see #poll(Event)
   */
  feed() {
    return null;
  }

  /**
   * Feeds {@link #handle(Event)} with the returned event. Returns null by default,
   * i.e., it should be implemented by your Agent derived classes.
   * Use it in place of {@link #feed()} which takes lower-precedence.
   * <p>
   * Automatically call by the main event loop (
   * {@link InputHandler#handle()}). See ProScene's Space-Navigator
   * example.
   *
   * @see InputHandler#handle()
   * @see #feed()
   * @see #pollFeed()
   * @see #handle(Event)
   * @see #poll(Event)
   */
  handleFeed() {
    return null;
  }

  /**
   * Feeds {@link #poll(Event)} with the returned event. Returns null
   * by default,i.e., it should be implemented by your Agent derived classes.
   * Use it in place of {@link #feed()} which takes lower-precedence.
   * <p>
   * Automatically call by the main event loop (
   * {@link InputHandler#handle()}).
   *
   * @see InputHandler#handle()
   * @see #feed()
   * @see #handleFeed()
   * @see #handle(Event)
   * @see #poll(Event)
   */
  pollFeed() {
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
   * {@link Grabber#track(Event)}) condition is met.
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
  poll(event) {
    if (
      event === null ||
      !this.inputHandler().isAgentRegistered(this) ||
      !this.isTracking()
    ) {
      return this.trackedGrabber();
    }
    // We first check if default grabber is tracked,
    // i.e., default grabber has the highest priority (which is good for
    // keyboards and doesn't hurt motion grabbers:
    const dG = this.defaultGrabber();
    if (dG !== null) {
      if (dG.track(event)) {
        this._trackedGrabber = dG;
        return this.trackedGrabber();
      }
    }
    // then if tracked grabber remains the matches:
    const tG = this.trackedGrabber();
    if (tG !== null) {
      if (tG.track(event)) return this.trackedGrabber();
    }
    // pick the first otherwise
    this._trackedGrabber = null;
    for (const grabber of this._grabberPool) {
      if (grabber !== dG && grabber !== tG) {
        if (grabber.track(event)) {
          this._trackedGrabber = grabber;
          break;
        }
      }
    }
    return this.trackedGrabber();
  }

  /**
   * Enqueues an Tuple(event, input()) on the
   * {@link InputHandler#tupleQueue()}, thus enabling a call on
   * the {@link #inputGrabber()}
   * {@link Grabber#interact(Event)} method (which is
   * scheduled for execution till the end of this main event loop iteration, see
   * {@link InputHandler#enqueueTuple(Tuple)} for
   * details).
   *
   * @see #inputGrabber()
   * @see #poll(Event)
   */
  handle(event) {
    if (
      event === null ||
      this.inputHandler() === null ||
      !this._handler.isAgentRegistered(this)
    ) {
      return false;
    }
    if (event.isNull()) {
      return false;
    }
    const inputGrabber = this.inputGrabber();
    if (inputGrabber !== null) {
      return this.inputHandler().enqueueEventTuple(
        new Tuple(event, inputGrabber));
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
    return this.trackedGrabber() !== null ? this.trackedGrabber() : this.defaultGrabber();
  }

  /**
   * Returns true if {@code grabber} is the agent's {@link #inputGrabber()} and false otherwise.
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
    return this._trackingEnabled;
  }

  /**
   * Enables tracking so that the {@link #inputGrabber()} may be updated when calling
   * {@link #poll(Event)}.
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
    this._trackingEnabled = enable;
    if (!this.isTracking()) {
      this._trackedGrabber = null;
    }
  }


  /**
   * Returns the grabber set after {@link #poll(Event)} is called. It
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
    return this.defaultGrabber() !== g1
      ? this.setDefaultGrabber(g1) ? true : this.setDefaultGrabber(g2)
      : this.setDefaultGrabber(g2);
  }

  /**
   * Sets the {@link #defaultGrabber()}
   * <p>
   * {@link #inputGrabber()}
   */
  setDefaultGrabber(grabber) {
    if (grabber === null) {
      this._defaultGrabber = null;
      return true;
    }
    if (!this.hasGrabber(grabber)) {
      console.warn(
        "To set an Agent default grabber the Grabber should be added into agent first. " +
        "Use one of the agent addGrabber() methods");
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

class Shortcut {
  /**
   * Constructs an "empty" shortcut. Same as: {@link #Shortcut(int)} with the integer
   * parameter being NO_NOMODIFIER_MASK if no parametes are passed.
   * @param mask modifier mask defining the shortcut
   * @param id gesture ig
   */
  constructor({ id = NO_ID, modifiers = NO_MODIFIER_MASK } = {}) {
    this._modifiers = modifiers;
    this._id = id;
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
    if(this.constructor.name === other.constructor.name)
      return this.id() === other.id() && this.modifiers() === other.modifiers();
    return false;
  }
}

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
const NO_ID = 0;
const NO_MODIFIER_MASK = 0;
const SHIFT            = 0b1;
const CTRL             = 0b10;
const META             = 0b100;
const ALT              = 0b1000;
const ALT_GRAPH        = 0b10000;

class Event {
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
   * Returns the shortcut encapsulated by this event.
   * @see Shortcut
   */
  shortcut() {
    return new Shortcut({ id: this.id(), modifiers: this.modifiers()});
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
// static fields
Event.NO_ID = NO_ID;
Event.NO_MODIFIER_MASK = NO_MODIFIER_MASK;
Event.SHIFT            = SHIFT;
Event.CTRL             = CTRL;
Event.META             = META;
Event.ALT              = ALT;
Event.ALT_GRAPH        = ALT_GRAPH;

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
 * This class represents {@link KeyEvent} shortcuts.
 * <p>
 * Key shortcuts can be of one out of two forms: 1. Characters (e.g., 'a'); 2.
 * Virtual keys (e.g., right arrow key); or, 2. Key combinations (e.g., CTRL key + virtual
 * key representing 'a').
 */
class KeyShortcut extends Shortcut {
  /**
   * Defines a key shortcut from the given character.
   *
   * @param key the character that defines the key shortcut.
   * @param mmodifiers  the mask
   * @param virtualKey the virtual key that defines the key shortcut.
   */
  constructor({ key = '\0', modifiers = NO_MODIFIER_MASK, virtualKey = NO_ID } = {}) {
    super({ modifiers, id: virtualKey });
    this._key = key;
  }
  /**
   * Returns the key-shortcut key.
   */
  getKey() {
    return this._key;
  }

  matches(other) {
    if(super.matches(other))
      return this.getKey() === other.getKey();
    return false;
  }
}

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
  constructor({ key = '\0', modifiers = NO_MODIFIER_MASK, virtualKey = NO_ID, other = null } = {}) {
    if ( other !== null ){
      super({ other });
      this._key = other._key;
    } else {
      super({ modifiers, id: virtualKey });
      this._key = key;
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
    if (this._key === '\0') {
      return new KeyShortcut({ modifiers: this.modifiers(), id: this.id() });
    }
    return new KeyShortcut({key: this.key()});
  }

  key() {
    return this._key;
  }
}

class TapShortcut extends Shortcut {
  /**
   * Defines a click shortcut from the given gesture-id, modifier mask, and number of
   * clicks.
   *
   * @param m  modifier mask
   * @param id id
   * @param c  bumber of clicks
   */
  constructor({ modifiers = NO_MODIFIER_MASK, id = NO_ID, count = 1 }) {
    super({ modifiers, id });
    this._count = count;
    if (count <= 0) this._count = 1;
  }

  /**
   * Returns the click-shortcut click count.
   */
  count() {
    return this._count;
  }

  matches(other) {
    if(super.matches(other))
      return this.count() === other.count();
    return false;
  }
}

class TapEvent extends Event {
  constructor({
    x = 0,
    y = 0,
    modifiers = NO_MODIFIER_MASK,
    id = NO_ID,
    count = 1,
    other = null } = {}) {
    if (other !== null) {
      super({ other });
      this._x = other._x;
      this._y = other._y;
      this._count = other._count;
    } else {
      super({ modifiers, id});
      this._x = x;
      this._y = y;
      this._count = count;
    }
  }

  get() {
    return new TapEvent({ other: this });
  }

  flush() {
    return super.flush();
  }

  fire() {
    return super.fire();
  }

  shortcut() {
    return new TapShortcut({ modifiers: this.modifiers(), id: this.id(), count: this.count() });
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
  count() {
    return this._count;
  }
}

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
 * Base class of all motion events defined from DOFs (degrees-of-freedom).
 * <p>
 * MotionEvents may be relative or absolute (see {@link #isRelative()}, {@link #isAbsolute()})
 * depending whether or not they're constructed from a previous MotionEvent. While
 * relative motion events have {@link #distance()}, {@link #speed()}, and
 * {@link #delay()}, absolute motion events don't.
 */
class MotionEvent extends Event {
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

  flush() {
    return super.flush();
  }

  fire() {
    return super.fire();
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
 * A {@link remixlab.bias.event.MotionEvent} with one degree of freedom ( {@link #x()}).
 */
class MotionEvent1 extends MotionEvent {
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

  flush() {
    return super.flush();
  }

  fire() {
    return super.fire();
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
 * A {@link remixlab.input.event.MotionEvent} with two degrees-of-freedom ({@link #x()}
 * and {@link #y()}).
 */
class MotionEvent2 extends MotionEvent {
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
      this._x = x; this._y = y;
      this._dx = dx; this._dy = dy;
      this._setPrevious(previous);
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
  event1(fromX = true) {
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

/**
 * A {@link remixlab.bias.event.MotionEvent} with three degrees-of-freedom ( {@link #x()},
 * {@link #y()} and {@link #z()} ).
 */
class MotionEvent3 extends MotionEvent {
  constructor({
    x = 0, y = 0, z = 0, dx = 0, dy = 0, dz = 0,
    modifiers = NO_MODIFIER_MASK, id = NO_ID, previous,
    other = null } = {}) {
    if (other) {
      super({ other });
      this._x = other._x; this._dx = other._dx; this._y = other._y;
      this._dy = other._dy; this._z = other._z; this._dz = other._dz;
    } else if (previous !== undefined) {
      super({ modifiers, id });
      this._x = x; this._y = y; this._z = z;
      this._dx = dx; this._dy = dy; this._dz = dz;
      this.setPreviousEvent(previous);
    } else if (dx !== null && dy !== null && dz !== null) {
      super({ modifiers, id });
      this._dx = dx; this._dy = dy; this._dz = dz;
    } else {
      throw Error("Invalid number of parameters in MotionEvent3 instantiation");
    }
  }

  get() {
    return new MotionEvent3({ other: this });
  }

  flush() {
    return super.flush();
  }

  fire() {
    return super.fire();
  }

  setPreviousEvent(previous) {
    this._relative = true;
    if (previous !== null) {
      if (previous instanceof MotionEvent3 && previous.id() === this.id()) {
        this._dx = this.x() - previous.x();
        this._dy = this.y() - previous.y();
        this._dz = this.z() - previous.z();
        this._distance = MotionEvent.distance(
          this._x, this._y, this._z,
          previous.x(), previous.y(), previous.z(),
        );
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
  previousZ() {
    return this.z() - this.dz();
  }

  isNull() {
    if (this.dx() === 0 && this.dy() === 0 && this.dz() === 0 &&
    !this.fired() && !this.flushed()
    ) return true;
    return false;
  }

  /**
   * Reduces the event to a {@link remixlab.bias.event.MotionEvent2} (lossy reduction). Keeps
   * dof-1 and dof-2 and discards dof-3.
   */
  event2() {
    let pe2;
    let e2;
    if (this.isRelative()) {
      pe2 = new MotionEvent2({
        previous: null,
        x: this.previousX(),
        y: this.previousY(),
        modifiers: this.modifiers(),
        id: this.id(),
      });
      e2 = new MotionEvent2({
        previous: pe2,
        x: this.x(),
        y: this.y(),
        modifiers: this.modifiers(),
        id: this.id(),
      });
    } else {
      e2 = new MotionEvent2({
        dx: this.dx(),
        dy: this.dy(),
        modifiers: this.modifiers(),
        id: this.id(),
      });
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
class MotionEvent6 extends MotionEvent {
  constructor({
    x = 0, y = 0, z = 0, dx = 0, dy = 0, dz = 0,
    rx = 0, ry = 0, rz = 0, drx = 0, dry = 0, drz = 0,
    modifiers = NO_MODIFIER_MASK, id = NO_ID, previous, other = null
  } = {}) {
    if (other) {
      super({ other });
      this._x = other._x; this._dx = other._dx;
      this._y = other._y; this._dy = other._dy;
      this._z = other._z; this._dz = other._dz;
      this._rx = other._rx; this._drx = other._drx;
      this._ry = other._ry; this._dry = other._dry;
      this._rz = other._rz; this._drz = other._drz;
    } else if (previous !== undefined) {
      super({ modifiers, id });
      this._x = x; this._y = y; this._z = z;
      this._rx = rx; this._ry = ry; this._rz = rz;
      this._dx = dx; this._dy = dy; this._dz = dz;
      this._drx = drx; this._dry = dry; this._drz = drz;
      this.setPreviousEvent(previous);
    } else if (
      dx !== null && dy !== null && dz !== null &&
      drx !== null && dry !== null && drz !== null) {
      super({ modifiers, id });
      this._dx = dx; this._dy = dy; this._dz = dz;
      this._drx = drx; this._dry = dry; this._drz = drz;
    } else {
      throw Error("Invalid number of parameters in MotionEvent6 instantiation");
    }
  }

  get() {
    return new MotionEvent6({ other: this });
  }

  flush() {
    return super.flush();
  }

  fire() {
    return super.fire();
  }

  setPreviousEvent(previous) {
    this._relative = true;
    if (previous !== null) {
      if (previous instanceof MotionEvent6 && previous.id() === this.id()) {
        this._dx = this.x() - previous.x();
        this._dy = this.y() - previous.y();
        this._dz = this.z() - previous.z();
        this._drx = this.rx() - previous.rx();
        this._dry = this.ry() - previous.ry();
        this._drz = this.rz() - previous.rz();
        this._distance = MotionEvent.distance(
          this._x, this._y, this._z,
          this._rx, this._ry, this._rz,
          previous.x(), previous.y(), previous.z(),
          previous.rx(), previous.ry(), previous.rz(),
        );
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
  previousZ() {
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
  previousRX() {
    return this._rx() - this._drx();
  }

  /**
   * @return previous dof5, only meaningful if the event {@link #isRelative()}
   */
  previousRY() {
    return this._ry() - this._dry();
  }

  /**
   * @return previous dof6, only meaningful if the event {@link #isRelative()}
   */
  previousRZ() {
    return this._rz() - this._drz();
  }

  isNull() {
    if (
      this.dx() === 0 && this.dy() === 0 && this.dz() === 0 &&
      this.drx() === 0 && this.dry() === 0 && this.drz() === 0 &&
      !this.fired() && !this.flushed()
    ) return true;
    return false;
  }

  /**
   * Reduces the event to a {@link remixlab.bias.event.MotionEvent3} (lossy reduction).
   *
   * @param fromTranslation if true keeps dof1, dof2 and dof3; otherwise keeps dof4, dof4 and dof6.
   */
  event3(fromTranslation = true) {
    let pe3;
    let e3;
    if (this.isRelative()) {
      if (fromTranslation) {
        pe3 = new MotionEvent3({
          previous: null,
          x: this.prevX(),
          y: this.prevY(),
          z: this.prevZ(),
          modifiers: this.modifiers(),
          id: this.id(),
        });
        e3 = new MotionEvent3({
          previous: pe3,
          x: this.x(),
          y: this.y(),
          z: this.z(),
          modifiers: this.modifiers(),
          id: this.id(),
        });
      } else {
        pe3 = new MotionEvent3({
          previous: null,
          x: this.prevRX(),
          y: this.prevRY(),
          z: this.prevRZ(),
          modifiers: this.modifiers(),
          id: this.id(),
        });
        e3 = new MotionEvent3({
          previous: pe3,
          x: this.rx(),
          y: this.ry(),
          z: this.rz(),
          modifiers: this.modifiers(),
          id: this.id(),
        });
      }
    } else if (fromTranslation) {
      e3 = new MotionEvent3({
        dx: this.dx(),
        dy: this.dy(),
        dz: this.dz(),
        modifiers: this.modifiers(),
        id: this.id(),
      });
    } else {
      e3 = new MotionEvent3({
        dx: this.drx(),
        dy: this.dry(),
        dz: this.drz(),
        modifiers: this.modifiers(),
        id: this.id(),
      });
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
 * Returns a {@link MotionEvent1} from the MotionEvent x-coordinate if
 * {@code fromX} is {@code true} and from the y-coordinate otherwise.
 */
MotionEvent.event1 = function(event, fromX = true) {
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
MotionEvent.event2 = function(event, fromX = true) {
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
MotionEvent.event3 = function(event, fromTranslation = true) {
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
MotionEvent.event6 = function(event) {
  if (event instanceof MotionEvent6) return event;
  return null;
}

const event = {
  TapEvent,
  TapShortcut,
  MotionEvent1,
  MotionEvent2,
  MotionEvent3,
  MotionEvent6,
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
 * The InputHandler object is the high level package handler which holds a collection of
 * {@link #agents()}, and an event dispatcher queue of
 * {@link Tuple}s ({@link #tupleQueue()}). Such tuple
 * represents a message passing to application objects, allowing an object to be
 * instructed to interact a particular user-defined action from a given
 * {@link Event}. For an introduction to BIAS please refer to
 * <a href="http://nakednous.github.io/projects/bias">this</a>.
 * <p>
 * At runtime, the inputGrabber handler should continuously run the two loops defined in
 * {@link #handle()}. Therefore, simply attach a call to {@link #handle()} at the end of
 * your main event (drawing) loop for that to take effect.
 */
class InputHandler {
  constructor() {
    // D E V I C E S & E V E N T S
    // Agents
    this._agents = new Set();
    // Events
    this._tupleQueue = new Array();
  }

  /**
   * Main handler method. Call it at the end of your main event (drawing) loop.
   * <p>
   * The handle comprises the following two loops:
   * <p>
   * 1. {@link Tuple} producer loop which for each
   * registered agent calls: a.
   * {@link Agent#poll(Event)}; and, b.
   * {@link Agent#handle(Event)}. Note that the event are
   * obtained from the agents callback
   * {@link Agent#pollFeed()} and
   * {@link Agent#handleFeed()} methods, respectively. The event
   * may also be obtained from {@link Agent#handleFeed()} which may
   * replace both of the previous feeds when they are null.<br>
   * 2. User-defined action consumer loop: which for each
   * {@link Tuple} calls
   * {@link Tuple#interact()}.<br>
   *
   * @see Agent#feed()
   * @see Agent#pollFeed()
   * @see Agent#handleFeed()
   */
  handle() {
    // 1. Agents
    for (const agent of this._agents) {
      agent.poll(agent.pollFeed() !== null ? agent.pollFeed() : agent.feed());
      agent.handle(agent.handleFeed() !== null ? agent.handleFeed() : agent.feed());
    }
    // 2. Low level events
    while (this._tupleQueue.length > 0) {
      this._tupleQueue.shift().interact();
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
    return this._agents.has(agent);
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
   * Returns the tuple queue. Rarely needed.
   */
  tupleQueue() {
    return this._tupleQueue;
  }

  /**
   * Enqueues the eventTuple for later execution which happens at the end of
   * {@link #handle()}. Returns {@code true} if succeeded and {@code false} otherwise.
   *
   * @see #handle()
   */
  enqueueEventTuple(tuple) {
    if (!this._tupleQueue.includes(tuple)) {
      return this._tupleQueue.push(tuple);
    }
    return false;
  }

  /**
   * Removes the given event from the event queue. No action is executed.
   *
   * @param event to be removed.
   */
  removeTuple(event) {
    this._tupleQueue.delete(event);
  }

  /**
   * Clears the event queue. Nothing is executed.
   */
  removeTuples() {
    this._tupleQueue.clear();
  }
}

/**
 */
const bias = {
  Agent,
  Event,
  event,
  EventGrabberTuple: Tuple,
  InputHandler,
  Shortcut,
};

return bias;

})));
