import Event from '../Event';
import KeyShortcut from './KeyShorcut';

/**
 * A key-event is an {@link Event} specialization that
 * encapsulates a {@link KeyShortcut}. Key shortcuts may be
 * of one form out of two: 1. A single Character; or, 2. A modifier mask (such as: (ALT |
 * SHIFT)) plus a virtual-key.
 * <p>
 * <b>Note</b> that virtual key codes are used to report which keys have been
 * pressed, rather than a character generated by the combination of one or more keystrokes
 * (such as "A", which comes from shift and "a"). Their values depend on the platform your
 * running your code. In Java, for instance, have a look at
 * <a href= "http://docs.oracle.com/javase/7/docs/api/java/awt/event/KeyEvent.html">
 * KeyEvent</a> to get some VK_* values. Note that Proscene sets them automatically from
 * the platform where the framework is running.
 */
export default class KeyEvent extends Event {

  /**
   * Constructs a keyevent with <b>c</b> defining its
   * {@link KeyShortcut}.
   */
  constructor({ char = null, modifiers = null, vk = null, other = null }) {
    if (char !== null) {
      super();
      this._key = char;
    } else if (modifiers !== null && vk !== null) {
      super({ modifiers, id: vk });
      this._key = '\0';
    } else if (vk !== null && modifiers === null) {
      super({ id: vk });
      this._key = '\0';
    } else {
      super({ other });
      this._key = other.key();
    }
  }


  get() {
    return new KeyEvent({ other: this });
  }

  flush() {
    return super.flush();
  }

  fire() {
    return super.fire();
  }

  shortcut() {
    if (this._key === '\0') return new KeyShortcut({ modifiers: this.modifiers(), id: this.id() });
    return new KeyShortcut({ key: this.key() });
  }

  key() {
    return this._key;
  }
}
