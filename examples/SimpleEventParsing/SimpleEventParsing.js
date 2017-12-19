/**
 * Simple Event Parsing
 * by Jean Pierre Charalambos
 *
 * Event parsing is based on the event.id()
 */

let agent;
let inputHandler;
let ellipses = [];

function setup() {
  canvas = createCanvas(600, window.innerHeight);
  canvas.parent('SimpleEvent');
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
  for (let i = 0; i < 100; i++){
    const ellipse = new Ellipse();
    ellipses.push(ellipse);
    //Associate the Ellipse with the Agent
    agent.addGrabber(ellipse);
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
  if(!MouseAgent.STOP){
    inputHandler.handle();
  }
}
