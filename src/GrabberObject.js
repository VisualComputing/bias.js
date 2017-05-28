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

import remixlab.bias.event.*;

/**
 * {@link Grabber} object which eases third-party implementation of the
 * {@link Grabber} interface.
 * <p>
 * Based on the concrete event type, this model object splits the
 * {@link #checkIfGrabsInput(Event)} and the {@link #performInteraction(Event)}
 * methods into more specific versions of them, e.g.,
 * {@link #checkIfGrabsInput(ClickEvent)}, {@link #checkIfGrabsInput(DOF3Event)},
 * {@link #performInteraction(DOF6Event)} , {@link #performInteraction(KeyEvent)} and
 * so on. Thus allowing implementations of this abstract GrabberObject to override only
 * those method signatures that might be of their interest.
 */
abstract class GrabberObject implements Grabber {
  /**
   * Empty constructor.
   */
  GrabberObject() {
  }

  /**
   * Constructs and adds this grabber to the agent pool.
   *
   * @see Agent#grabbers()
   */
  GrabberObject(Agent agent) {
    
  }

  /**
   * Constructs and adds this grabber to all agents belonging to the input handler.
   *
   * @see InputHandler#agents()
   */
  GrabberObject(InputHandler inputHandler) {
    
  }

  /**
   * Check if this object is the {@link Agent#inputGrabber()} . Returns
   * {@code true} if this object grabs the agent and {@code false} otherwise.
   */
  boolean grabsInput(Agent agent) {
    
  }

  /**
   * Checks if the frame grabs input from any agent registered at the given input handler.
   */
  boolean grabsInput(InputHandler inputHandler) {
    }

  @Override
  void performInteraction(Event event) {
    }

  /**
   * Calls performInteraction() on the proper motion event:
   * {@link remixlab.bias.event.DOF1Event}, {@link remixlab.bias.event.DOF2Event},
   * {@link remixlab.bias.event.DOF3Event} or {@link remixlab.bias.event.DOF6Event}.
   * <p>
   * Override this method when you want the object to perform an interaction from a
   * {@link remixlab.bias.event.MotionEvent}.
   */
  void performInteraction(MotionEvent event) {    
  }

  /**
   * Override this method when you want the object to perform an interaction from a
   * {@link KeyEvent}.
   */
  void performInteraction(KeyEvent event) {
  }

  /**
   * Override this method when you want the object to perform an interaction from a
   * {@link remixlab.bias.event.ClickEvent}.
   */
  void performInteraction(ClickEvent event) {
  }

  /**
   * Override this method when you want the object to perform an interaction from a
   * {@link remixlab.bias.event.DOF1Event}.
   */
  void performInteraction(DOF1Event event) {
  }

  /**
   * Override this method when you want the object to perform an interaction from a
   * {@link remixlab.bias.event.DOF2Event}.
   */
  void performInteraction(DOF2Event event) {
  }

  /**
   * Override this method when you want the object to perform an interaction from a
   * {@link remixlab.bias.event.DOF3Event}.
   */
  void performInteraction(DOF3Event event) {
  }

  /**
   * Override this method when you want the object to perform an interaction from a
   * {@link remixlab.bias.event.DOF6Event}.
   */
  void performInteraction(DOF6Event event) {
  }

  @Override
  boolean checkIfGrabsInput(Event event) {
    
  }

  /**
   * Calls checkIfGrabsInput() on the proper motion event:
   * {@link remixlab.bias.event.DOF1Event}, {@link remixlab.bias.event.DOF2Event},
   * {@link remixlab.bias.event.DOF3Event} or {@link remixlab.bias.event.DOF6Event}.
   * <p>
   * Override this method when you want the object to be picked from a
   * {@link KeyEvent}.
   */
  boolean checkIfGrabsInput(MotionEvent event) {
    
  }

  /**
   * Override this method when you want the object to be picked from a
   * {@link KeyEvent}.
   */
  boolean checkIfGrabsInput(KeyEvent event) {
  }

  /**
   * Override this method when you want the object to be picked from a
   * {@link remixlab.bias.event.ClickEvent}.
   */
  boolean checkIfGrabsInput(ClickEvent event) {

  }

  /**
   * Override this method when you want the object to be picked from a
   * {@link remixlab.bias.event.DOF1Event}.
   */
  boolean checkIfGrabsInput(DOF1Event event) {
  }

  /**
   * Override this method when you want the object to be picked from a
   * {@link remixlab.bias.event.DOF2Event}.
   */
  boolean checkIfGrabsInput(DOF2Event event) {
  }

  /**
   * Override this method when you want the object to be picked from a
   * {@link remixlab.bias.event.DOF3Event}.
   */
  boolean checkIfGrabsInput(DOF3Event event) {
  }

  /**
   * Override this method when you want the object to be picked from a
   * {@link remixlab.bias.event.DOF6Event}.
   */
  boolean checkIfGrabsInput(DOF6Event event) {
  }
}
