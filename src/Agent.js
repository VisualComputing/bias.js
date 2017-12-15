import Tuple from './Tuple';
import Interface from './Interface';

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
export default class Agent {
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
    Interface.Grabber.ensureImplements(grabber);
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
