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
export default class InputHandler {
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
