import { NO_ID, NO_MODIFIER_MASK } from '../Event';
import Shortcut from '../Shortcut';

export default class TapShortcut extends Shortcut {
  /**
   * Defines a click shortcut from the given gesture-id, modifier mask, and number of
   * clicks.
   *
   * @param m  modifier mask
   * @param id id
   * @param c  bumber of clicks
   */
  constructor({ modifiers = NO_MODIFIER_MASK, id = NO_ID, count = 1 } = {}) {
    super({ modifiers, id });
    this._count = count;
    if (count <= 0) this._count = 1;
  }

  /**
   * Returns the click-shortcut click count.
   */
  count() {
    return this._count;
  }

  matches(other) {
    if(super.matches(other))
      return this.count() === other.count();
    return false;
  }
}
