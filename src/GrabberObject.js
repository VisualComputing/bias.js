abstract class GrabberObject implements Grabber {
  /**
   * Empty constructor.
   */
  GrabberObject() {
  }

  /**
   * Constructs and adds this grabber to the agent pool.
   *
   * @see Agent#grabbers()
   */
  GrabberObject(Agent agent) {
    
  }

  /**
   * Constructs and adds this grabber to all agents belonging to the input handler.
   *
   * @see InputHandler#agents()
   */
  GrabberObject(InputHandler inputHandler) {
    
  }

  /**
   * Check if this object is the {@link Agent#inputGrabber()} . Returns
   * {@code true} if this object grabs the agent and {@code false} otherwise.
   */
  boolean grabsInput(Agent agent) {
    
  }

  /**
   * Checks if the frame grabs input from any agent registered at the given input handler.
   */
  boolean grabsInput(InputHandler inputHandler) {
    }

  @Override
  void performInteraction(Event event) {
    }

  /**
   * Calls performInteraction() on the proper motion event:
   * {@link remixlab.bias.event.DOF1Event}, {@link remixlab.bias.event.DOF2Event},
   * {@link remixlab.bias.event.DOF3Event} or {@link remixlab.bias.event.DOF6Event}.
   * <p>
   * Override this method when you want the object to perform an interaction from a
   * {@link remixlab.bias.event.MotionEvent}.
   */
  void performInteraction(MotionEvent event) {    
  }

  /**
   * Override this method when you want the object to perform an interaction from a
   * {@link KeyEvent}.
   */
  void performInteraction(KeyEvent event) {
  }

  /**
   * Override this method when you want the object to perform an interaction from a
   * {@link remixlab.bias.event.ClickEvent}.
   */
  void performInteraction(ClickEvent event) {
  }

  /**
   * Override this method when you want the object to perform an interaction from a
   * {@link remixlab.bias.event.DOF1Event}.
   */
  void performInteraction(DOF1Event event) {
  }

  /**
   * Override this method when you want the object to perform an interaction from a
   * {@link remixlab.bias.event.DOF2Event}.
   */
  void performInteraction(DOF2Event event) {
  }

  /**
   * Override this method when you want the object to perform an interaction from a
   * {@link remixlab.bias.event.DOF3Event}.
   */
  void performInteraction(DOF3Event event) {
  }

  /**
   * Override this method when you want the object to perform an interaction from a
   * {@link remixlab.bias.event.DOF6Event}.
   */
  void performInteraction(DOF6Event event) {
  }

  @Override
  boolean checkIfGrabsInput(Event event) {
    
  }

  /**
   * Calls checkIfGrabsInput() on the proper motion event:
   * {@link remixlab.bias.event.DOF1Event}, {@link remixlab.bias.event.DOF2Event},
   * {@link remixlab.bias.event.DOF3Event} or {@link remixlab.bias.event.DOF6Event}.
   * <p>
   * Override this method when you want the object to be picked from a
   * {@link KeyEvent}.
   */
  boolean checkIfGrabsInput(MotionEvent event) {
    
  }

  /**
   * Override this method when you want the object to be picked from a
   * {@link KeyEvent}.
   */
  boolean checkIfGrabsInput(KeyEvent event) {
  }

  /**
   * Override this method when you want the object to be picked from a
   * {@link remixlab.bias.event.ClickEvent}.
   */
  boolean checkIfGrabsInput(ClickEvent event) {

  }

  /**
   * Override this method when you want the object to be picked from a
   * {@link remixlab.bias.event.DOF1Event}.
   */
  boolean checkIfGrabsInput(DOF1Event event) {
  }

  /**
   * Override this method when you want the object to be picked from a
   * {@link remixlab.bias.event.DOF2Event}.
   */
  boolean checkIfGrabsInput(DOF2Event event) {
  }

  /**
   * Override this method when you want the object to be picked from a
   * {@link remixlab.bias.event.DOF3Event}.
   */
  boolean checkIfGrabsInput(DOF3Event event) {
  }

  /**
   * Override this method when you want the object to be picked from a
   * {@link remixlab.bias.event.DOF6Event}.
   */
  boolean checkIfGrabsInput(DOF6Event event) {
  }
}
