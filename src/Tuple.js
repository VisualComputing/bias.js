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
export default class Tuple {
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
