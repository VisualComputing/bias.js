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

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

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
  // D E V I C E S & E V E N T S
  List<Agent> agents;
  LinkedList<EventGrabberTuple> eventTupleQueue;

  InputHandler() {
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
  void handle() {
    // 1. Agents
  }

  /**
   * Calls {@link Agent#addGrabber(Grabber)} on registered
   * {@link #agents()}.
   */
  void addGrabber(Grabber grabber) {
  }

  /**
   * Calls {@link Agent#removeGrabber(Grabber)} on registered
   * {@link #agents()}.
   */
  void removeGrabber(Grabber grabber) {
  }

  /**
   * Calls {@link Agent#removeGrabbers()} on registered
   * {@link #agents()}.
   */
  void removeGrabbers() {
  }

  /**
   * Calls {@link Agent#setDefaultGrabber(Grabber)} on registered
   * {@link #agents()}.
   */
  void setDefaultGrabber(Grabber grabber) {
  }

  /**
   * Calls {@link Agent#shiftDefaultGrabber(Grabber, Grabber)} on
   * registered {@link #agents()}.
   */
  void shiftDefaultGrabber(Grabber g1, Grabber g2) {
  }

  /**
   * Returns {@code true} if {@link Agent#isInputGrabber(Grabber)} is
   * {@code true} for at least one agent in {@link #agents()}.
   */
  isInputGrabber(Grabber g) {
  }

  /**
   * Returns {@code true} if {@link Agent#hasGrabber(Grabber)} is
   * {@code true} for at least one agent in {@link #agents()}.
   */
  hasGrabber(Grabber g) {
  }

  /**
   * Calls {@link Agent#resetTrackedGrabber()} on registered
   * {@link #agents()}.
   */
  void resetTrackedGrabber() {
  }

  /**
   * Returns a list of the registered agents.
   */
  List<Agent> agents() {
  }

  /**
   * Registers the given agent.
   */
  registerAgent(Agent agent) {
  }

  /**
   * Returns true if the given agent is registered.
   */
  isAgentRegistered(Agent agent) {
  }

  /**
   * Unregisters the given agent.
   */
  unregisterAgent(Agent agent) {
  }

  /**
   * Unregisters all agents from the handler.
   */
  void unregisterAgents() {
  }

  /**
   * Returns the event tuple queue. Rarely needed.
   */
  LinkedList<EventGrabberTuple> eventTupleQueue() {
  }

  /**
   * Enqueues the eventTuple for later execution which happens at the end of
   * {@link #handle()}. Returns {@code true} if succeeded and {@code false} otherwise.
   *
   * @see #handle()
   */
  enqueueEventTuple(EventGrabberTuple eventTuple) {
  }

  /**
   * Removes the given event from the event queue. No action is executed.
   *
   * @param event to be removed.
   */
  void removeEventTuple(Event event) {
  }

  /**
   * Clears the event queue. Nothing is executed.
   */
  void removeEventTuples() {
  }
}
