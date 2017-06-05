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
export default class Grabber {
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
