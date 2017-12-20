/**************************************************************************************
 * bias_tree
 * Copyright (c) 2014-2017 National University of Colombia, https://github.com/remixlab
 * @author Jean Pierre Charalambos, http://otrolado.info/
 *
 * All rights reserved. Library that eases the creation of interactive
 * scenes, released under the terms of the GNU Public License v3.0
 * which is available at http://www.gnu.org/licenses/gpl.html
 **************************************************************************************/

import { NO_ID, NO_MODIFIER_MASK } from '../Event';
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
   * @param virtualKey the virtual key that defines the key shortcut.
   */
  constructor({ key = '\0', modifiers = NO_MODIFIER_MASK, virtualKey = NO_ID } = {}) {
    super({ modifiers, id: virtualKey });
    this._key = key;
  }
  /**
   * Returns the key-shortcut key.
   */
  getKey() {
    return this._key;
  }

  matches(other) {
    if(super.matches(other))
      return this.getKey() === other.getKey();
    return false;
  }
}
