import Event, { NO_MODIFIER_MASk } from "../Event";
import ClickShortcut from "./ClickShortcut";

export default class ClickEvent extends Event {
  constructor({
    x = 0,
    y = 0,
    modifiers = NO_MODIFIER_MASk,
    shortcut,
    clicks = 1,
    other = null
  }) {
    super({ modifiers, id: shortcut, other });
    this._x = x;
    this._y = y;
    this._numberOfClicks = clicks;
    if (other !== null) {
      this._x = other._x;
      this._y = other._y;
      this._numberOfClicks = other._numberOfClicks;
    }
  }

  get() {
    return new ClickEvent(this);
  }

  flush() {
    return super.flush();
  }

  fire() {
    return super.fire();
  }

  shortcut() {
    return new ClickShortcut(this.modifiers(), this.id(), this.clickCount());
  }

  /**
   * @return event x coordinate
   */
  x() {
    return this.x;
  }

  /**
   * @return event y coordinate
   */
  y() {
    return this.y;
  }

  /**
   * @return event number of clicks
   */
  clickCount() {
    return this._numberOfClicks;
  }
}
