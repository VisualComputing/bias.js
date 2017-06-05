import Shortcut from '../Shortcut';

/**
 * This class represents {@link KeyEvent} shortcuts.
 * <p>
 * Key shortcuts can be of one out of two forms: 1. Characters (e.g., 'a'); 2.
 * Virtual keys (e.g., right arrow key); or, 2. Key combinations (e.g., CTRL key + virtual
 * key representing 'a').
 */
export default class KeyShortcut extends Shortcut {
  /**
   * Defines a key shortcut from the given character.
   *
   * @param key the character that defines the key shortcut.
   * @param mmodifiers  the mask
   * @param id the virtual key that defines the key shortcut.
   */
  constructor({ key = null, modifiers = null, id = null }) {
    if (key !== null) {
      super();
      this._key = key;
    } else if (modifiers !== null) {
      super({ modifiers, id });
      this._key = '\0';
    } else {
      super({ id });
      this._key = '\0';
    }
  }
  /**
   * Returns the key-shortcut key.
   */
  getKey() {
    return this._key;
  }

  matches(other) {
    if (other instanceof KeyShortcut) {
      return super.matches(other) && this.getKey() === other.getKey();
    }
    return false;
  }
}
