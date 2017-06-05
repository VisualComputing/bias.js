export default class EventGrabberTuple {

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
   * Calls {@link Grabber#performInteraction(Event)}.
   *
   * @return true if succeeded and false otherwise.
   */
  perform() {
    if (this._grabber === null || this._event === null) {
      return false;
    }
    this._grabber.performInteraction(event);
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
