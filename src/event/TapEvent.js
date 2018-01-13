import Event, { NO_ID, NO_MODIFIER_MASK } from '../Event';
import TapShortcut from './TapShortcut';

export default class TapEvent extends Event {
  constructor({
    x = 0,
    y = 0,
    modifiers = NO_MODIFIER_MASK,
    id = NO_ID,
    count = 1,
    other = null } = {}) {
    if (other !== null) {
      super({ other });
      this._x = other._x;
      this._y = other._y;
      this._count = other._count;
    } else {
      super({ modifiers, id});
      this._x = x;
      this._y = y;
      this._count = count;
    }
  }

  get() {
    return new TapEvent({ other: this });
  }

  shortcut() {
    return new TapShortcut({ modifiers: this.modifiers(), id: this.id(), count: this.count() });
  }

  /**
   * @return event x coordinate
   */
  x() {
    return this._x;
  }

  /**
   * @return event y coordinate
   */
  y() {
    return this._y;
  }

  /**
   * @return event number of clicks
   */
  count() {
    return this._count;
  }
}
