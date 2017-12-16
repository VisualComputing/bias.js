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
export default class InputHandler {
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
