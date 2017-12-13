/**
 * Shortcut-based Event Parsing
 * by Jean Pierre Charalambos
 *
 * Event parsing is based on the event.shortcut()
 */

let agent;
let inputHandler;
let ellipses = [];
let canvas;

function setup() {
  canvas = createCanvas(640, 360);
  inputHandler = new bias.InputHandler();
  agent = new MouseAgent(inputHandler);
  //Register methods
  //on drag
  canvas.mouseMoved( function(event){
    agent.mouseEvent(event);
  });
  canvas.mouseClicked( function(event){
    agent.mouseEvent(event);
  });
  canvas.mousePressed( function(event){
    agent.mouseEvent(event);
  });
  canvas.mouseReleased( function(event){
    agent.mouseEvent(event);
  });
  for (let i = 0; i < 50; i++) {
    const check = inputHandler instanceof bias.InputHandler;
    console.log("check :" + check);
    ellipses.push(new Ellipse(inputHandler));
  }
}

function draw() {
  background(255);
  for (let i = 0; i < ellipses.length; i++) {
    if ( ellipses[i].grabsInput(agent) )
      ellipses[i].draw(color(255, 0, 0));
    else
      ellipses[i].draw();
  }
  inputHandler.handle();
}

function keyPressed(){
  if (key == ' ') {
    agent.click2Pick = !agent.click2Pick;
    agent.resetTrackedGrabber();
    for (let i = 0; i < ellipses.length; i++)
    if (agent.click2Pick)
      ellipses[i].setMouseMoveBindings();
    else
      ellipses[i].setMouseDragBindings();
  }
}