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
  canvas = createCanvas(600, window.innerHeight);
  canvas.parent('Shortcut');
  inputHandler = new bias.InputHandler();
  agent = new MouseAgent(inputHandler);
  //Register methods

  for (let i = 0; i < 100; i++) {
    const ellipseVar = new Ellipse();
    ellipses.push(ellipseVar);
    //Associate the Ellipse with the InputHandler
    inputHandler.addGrabber(ellipseVar);
  }
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
