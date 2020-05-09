let robo;
let paTH;

var dragging = false;
var draggedPoint = null;
var rolled = false;
var isNewPoint = false;
var isDeletePoint = false;

var pathPoints = [];

var offX;
var offY;

let bg;

function preload(){
  bg = loadImage('field.jpg');
}

function setup() {
  createCanvas(400, 400);
  
  robo = new Robot(400, 200);
  paTH = new Path();

  //generate node points for the path and place in array
  for(let i=0; i< 10; i++){
    let x = 100*cos(float(i)/10.0 * Math.PI * 2.0) + width/2;
    let y = 100*sin(float(i)/10.0 * Math.PI * 2.0) + height/2;
    paTH.points[i] = createVector(x,y);
  }
}

function draw() {
  background(bg);
  let mouse = createVector(mouseX, mouseY);

  //add new point when button is pressed
  if(isNewPoint){
    paTH.addPoint(mouse);
    isNewPoint = false;
  }

  //generate points for the path
  //also make it so the user can click and drag the points
  for(let c=0;c<paTH.points.length; c++){
    let desPos = createVector(paTH.points[c].x, paTH.points[c].y);
    let des = p5.Vector.sub(desPos, mouse);

    //check if the mouse is close to a node point
    if(des.mag() < 10){

      rolled = true;  //mouse is hovering over point
      
      //move point when mouse is clicked and held
      if(dragging && paTH.points.length != 0){
        fill(50);
        paTH.points[draggedPoint].set(mouseX+offX, mouseY+offY);
      }
      else{fill(100);}

      //delete point the mouse is hovering over 
      if(isDeletePoint && rolled){
        paTH.deletePoint(c);
        isDeletePoint = false;
      }
    }
    else{
      rolled = false;
      fill(255,255,127);
    }
    
    //mark the node points with a circle
    if(paTH.points.length != 0){
      ellipse(paTH.points[c].x, paTH.points[c].y, 10);
    }
  }

  // generate path 
  noFill();
  beginShape(POINTS);
  for(let i=0; i<float(paTH.points.length)-3.0; i+=0.005){
      let pos = paTH.getSplinePoints(i);
      pathPoints[i] = createVector(pos.x, pos.y); //store path points into an array
      vertex(pathPoints[i].x, pathPoints[i].y); //draw out path
  }
  endShape();


  //start the robot and make it follow the path
  robo.follow(pathPoints, paTH);
  robo.run();
}

function mousePressed(){
  //check if mouse is hovering over a node point when mouse is clicked
  for(let c=0;c<paTH.points.length; c++){
    let mouse = createVector(mouseX, mouseY);
    let desPos = createVector(paTH.points[c].x, paTH.points[c].y);
    let des = p5.Vector.sub(desPos, mouse);

    if(des.mag() < 10){
      dragging = true;  
      offX = des.x;   //find the offset x and y from node point
      offY = des.y;

      draggedPoint = c; //store the point being dragged 
    }
  }
}

function keyPressed(){
  //key to add new point
  if(keyCode == CONTROL){
    isNewPoint = true;
  }
  //key to delete an old point
  if(keyCode == BACKSPACE){
    isDeletePoint = true;
  }
}

function keyReleased(){
  isNewPoint = false;
  isDeletePoint = false;
}

function mouseReleased(){
  dragging = false;
  draggedPoint = null;
}
