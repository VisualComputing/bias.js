import Agent from './Agent';
import InputHandler from './InputHandler';
import KeyEvent from './event/KeyEvent';
import ClickEvent from './event/ClickEvent';
import MotionEvent from './event/MotionEvent';
import DOF1Event from './event/DOF1Event';
import DOF2Event from './event/DOF2Event';
import DOF3Event from './event/DOF3Event';
import DOF6Event from './event/DOF6Event';

export default class GrabberObject extends Grabber {
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
