public class HIDAgent extends Agent {
  public HIDAgent(InputHandler handler) {
    super(handler);
  }

  // polling is done by overriding the feed agent method
  // note that we pass the id of the gesture
  @Override
  public MotionEvent6 feed() {
    return new MotionEvent6(-10*sliderXpos.getValue(), -10*sliderYpos.getValue(),
                            10*sliderZpos.getValue(), 10*sliderXrot.getValue(),
                            10*sliderYrot.getValue(), 10*sliderZrot.getValue(),
                            remixlab.bias.Event.NO_MODIFIER_MASK, SN_ID);
  }
}
