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

/**
 * A [{@link Event},{@link Grabber}] tuple. An
 * enqueued tuple fires {@link Grabber#performInteraction(Event)}
 * call from the event in the tuple.
 * <p>
 * Tuples are typically enqueued by an agent (see
 * {@link Agent#handle(Event)}), but may be enqueued manually, see
 * {@link InputHandler#enqueueEventTuple(EventGrabberTuple)}.
 */
 class EventGrabberTuple {
  Event event;
  Grabber grabber;

  /**
   * Constructs a {@link Event},
   * {@link Grabber} tuple.
   *
   * @param e {@link Event}
   * @param g {@link Grabber}
   */
   EventGrabberTuple(Event e, Grabber g) {
  }

  /**
   * Calls {@link Grabber#performInteraction(Event)}.
   *
   * @return true if succeeded and false otherwise.
   */
   perform() {
  }

  /**
   * Returns the event from the tuple.
   */
   Event event() {
  }

  /**
   * Returns the object Grabber in the tuple.
   */
   Grabber grabber() {
  }
}
