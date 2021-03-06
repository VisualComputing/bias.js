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
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  inputHandler = new bias.InputHandler();
  agent = new MouseAgent(inputHandler);
  //Register methods
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
  canvas.mouseWheel( function(event){
    agent.mouseEvent(event);
  });

  for (let i = 0; i < 100; i++) {
    const ellipse = new Ellipse();
    ellipses.push(ellipse);
    //Associate the Ellipse with the InputHandler
    inputHandler.addGrabber(ellipse);
  }
}

function draw() {
  background(255);
  for (let i = 0; i < ellipses.length; i++) {
    if ( agent.inputGrabber() === ellipses[i] )
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