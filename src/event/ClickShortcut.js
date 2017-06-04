import { NO_MODIFIER_MASk } from "../Event";

export default class ClickShortcut extends Shortcut {
  /**
   * Defines a click shortcut from the given gesture-id, modifier mask, and number of
   * clicks.
   *
   * @param m  modifier mask
   * @param id id
   * @param c  bumber of clicks
   */
  constructor({ modifiers = NO_MODIFIER_MASk, id = null, clicks = 1 }) {
    super(modifiers, id);
    this._numberOfClicks = 1;
    if (clicks <= 0) this._numberOfClicks = 1;
    else this._numberOfClicks = clicks;
  }

  /**
   * Returns the click-shortcut click count.
   */
  clickCount() {
    return this._numberOfClicks;
  }

  matches(other) {
    if (other instanceof ClickShortcut) {
      return super.matches(other) && this.clickCount() === other.clickCount();
    }
    return false;
  }
}
