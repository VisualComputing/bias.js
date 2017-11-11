public class HIDAgent extends Agent {
  public HIDAgent(InputHandler handler) {
    super(handler);
  }

  // polling and handle is done by overriding the feed() agent method
  // we need only handle since polling is done through the mouseAgent
  @Override
  public MotionEvent6 handleFeed() {
    return new MotionEvent6(10*sliderXpos.getValue(), 10*sliderYpos.getValue(),
                            10*sliderZpos.getValue(), 10*sliderXrot.getValue(),
                            10*sliderYrot.getValue(), 10*sliderZrot.getValue(),
                            remixlab.bias.Event.NO_MODIFIER_MASK, SN_ID);
  }
}
