/**************************************************************************************
 * bias_tree
 * Copyright (c) 2014-2017 National University of Colombia, https://github.com/remixlab
 * @author Jean Pierre Charalambos, http://otrolado.info/
 *
 * All rights reserved. Library that eases the creation of interactive
 * scenes, released under the terms of the GNU Public License v3.0
 * which is available at http://www.gnu.org/licenses/gpl.html
 **************************************************************************************/

import Agent from './Agent';
import InputHandler from './InputHandler';
import KeyEvent from './event/KeyEvent';
import TapEvent from './event/TapEvent';
import MotionEvent from './event/MotionEvent';
import MotionEvent1 from './event/MotionEvent1';
import MotionEvent2 from './event/MotionEvent2';
import MotionEvent3 from './event/MotionEvent3';
import MotionEvent6 from './event/MotionEvent6';

/**
 * {@link Grabber} object which eases third-party implementation of the
 * {@link Grabber} interface.
 * <p>
 * Based on the concrete event type, this model object splits the
 * {@link #track(Event)} and the {@link #interact(Event)}
 * methods into more specific versions of them, e.g.,
 * {@link #track(TapEvent)}, {@link #track(MotionEvent3)},
 * {@link #interact(MotionEvent6)} , {@link #interact(KeyEvent)} and
 * so on. Thus allowing implementations of this abstract GrabberObject to override only
 * those method signatures that might be of their interest.
 */
export default class GrabberObject {
  /**
   * Constructs and adds this grabber either to the agent pool @see Agent#grabbers()
   * or to all agents belonging to the inputGrabber handler. @see InputHandler#agents()
   */
  constructor(agentOrInputHandler) {
    if (agentOrInputHandler instanceof Agent || agentOrInputHandler instanceof InputHandler) {
      agentOrInputHandler.addGrabber(this);
    }
    else throw Error("A Grabber must be associated either with an Agent or an InputHandler");
  }

  /**
   * Check if this object is the {@link Agent#inputGrabber()} either from an agent or
   * from any agent registered at the given input handler.
   */
  static grabsInput(agentOrInputHandler) {
    if (agentOrInputHandler instanceof Agent) {
      return agentOrInputHandler.inputGrabber() === this;
    }
    if (agentOrInputHandler instanceof InputHandler) {
      for (const agent of agentOrInputHandler) {
        if (agent.inputGrabber() === this) return true;
      }
    }
    return false;
  }

  interact(event) {
    if (event instanceof KeyEvent) this.performInteractionKey(event);
    if (event instanceof TapEvent) this.performInteractionTap(event);
    if (event instanceof MotionEvent) this.performInteractionMotion(event);
  }

  /**
   * Calls performInteraction() on the proper motion event:
   * {@link MotionEvent1}, {@link MotionEvent2},
   * {@link MotionEvent3} or {@link MotionEvent6}.
   * <p>
   * Override this method when you want the object to interact an interaction from a
   * {@link remixlab.input.event.MotionEvent}.
   */
  performInteractionMotion(event) {
    if (event instanceof MotionEvent1) this.performInteractionMotion1(event);
    if (event instanceof MotionEvent2) this.performInteractionMotion2(event);
    if (event instanceof MotionEvent3) this.performInteractionMotion3(event);
    if (event instanceof MotionEvent6) this.performInteractionMotion6(event);
  }

  /**
   * Override this method when you want the object to perform an interaction from a
   * {@link KeyEvent}.
   */
  performInteractionKey(event) {
  }

  /**
   * Override this method when you want the object to perform an interaction from a
   * {@link TapEvent}.
   */
  performInteractionTap(event) {
  }

  /**
   * Override this method when you want the object to perform an interaction from a
   * {@link MotionEvent1}.
   */
  performInteractionMotion1(event) {
  }

  /**
   * Override this method when you want the object to perform an interaction from a
   * {@link MotionEvent2}.
   */
  performInteractionMotion2(event) {
  }

  /**
   * Override this method when you want the object to perform an interaction from a
   * {@link MotionEvent3}.
   */
  performInteractionMotion3(event) {
  }

  /**
   * Override this method when you want the object to perform an interaction from a
   * {@link MotionEvent6}.
   */
  performInteractionMotion6(event) {
  }

  track(event) {
    if (event instanceof KeyEvent) return this.trackKey(event);
    if (event instanceof TapEvent) return this.trackTap(event);
    if (event instanceof MotionEvent) return this.trackMotion(event);
    return false;
  }

  /**
   * Calls trackMotion() on the proper motion event:
   * {@link MotionEvent1}, {@link MotionEvent2},
   * {@link MotionEvent3} or {@link MotionEvent6}.
   * <p>
   * Override this method when you want the object to be picked from a
   * {@link KeyEvent}.
   */
  trackMotion(event) {
    if (event instanceof MotionEvent1) return this.trackMotion1(event);
    if (event instanceof MotionEvent2) return this.trackMotion2(event);
    if (event instanceof MotionEvent3) return this.trackMotion3(event);
    if (event instanceof MotionEvent6) return this.trackMotion6(event);
    return false;
  }

  /**
   * Override this method when you want the object to be picked from a
   * {@link KeyEvent}.
   */
  trackKey(event) {
    return false;
  }

  /**
   * Override this method when you want the object to be picked from a
   * {@link TapEvent}.
   */
  trackTap(event) {
    return false;
  }

  /**
   * Override this method when you want the object to be picked from a
   * {@link MotionEvent1}.
   */
  trackMotion1(event) {
    return false;
  }

  /**
   * Override this method when you want the object to be picked from a
   * {@link MotionEvent2}.
   */
  trackMotion2(event) {
    return false;
  }

  /**
   * Override this method when you want the object to be picked from a
   * {@link MotionEvent3}.
   */
  trackMotion3(event) {
    return false;
  }

  /**
   * Override this method when you want the object to be picked from a
   * {@link MotionEvent6}.
   */
  trackMotion6(event) {
    return false;
  }
}
