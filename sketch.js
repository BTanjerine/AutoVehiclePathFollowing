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


function setup() {
  createCanvas(400, 400);
  robo = new Robot(400, 100);
  paTH = new Path();

  for(let i=0; i< 6; i++){
    let x = 400 - (50*i);   //cos(float(i)/10.0 * Math.PI * 2.0) + width/2;
    let y = 100;   //sin(float(i)/10.0 * Math.PI * 2.0) + height/2;
    paTH.points[i] = createVector(x,y);
  }
}

function draw() {
  background(220);
  let mouse = createVector(mouseX, mouseY);

  if(isNewPoint){
    paTH.addPoint(mouse);
    isNewPoint = false;
  }

  //generate points for the path
  //also make it so the user can click and drag the points
  for(let c=0;c<paTH.points.length; c++){
    let desPos = createVector(paTH.points[c].x, paTH.points[c].y);
    let des = p5.Vector.sub(desPos, mouse);

    if(des.mag() < 10){
      rolled = true;
      if(dragging && paTH.points.length != 0){
        fill(50);
        paTH.points[draggedPoint].set(mouseX+offX, mouseY+offY);
      }
      else{fill(100);}

      if(isDeletePoint && rolled){
        paTH.deletePoint(c);
        isDeletePoint = false;
      }
    }
    else{
      rolled = false;
      noFill();
    }
    
    if(paTH.points.length != 0){
      ellipse(paTH.points[c].x, paTH.points[c].y, 5);
    }
  }

  // generate path 
  noFill();
  beginShape(POINTS);
  for(let i=0; i<float(paTH.points.length)-3.0; i+=0.005){
      let pos = paTH.getSplinePoints(i);
      pathPoints[i] = createVector(pos.x, pos.y);
      vertex(pathPoints[i].x, pathPoints[i].y);
  }
  endShape();

  robo.follow(pathPoints);
  robo.run();
}

function mousePressed(){

  for(let c=0;c<paTH.points.length; c++){
    let mouse = createVector(mouseX, mouseY);
    let desPos = createVector(paTH.points[c].x, paTH.points[c].y);
    let des = p5.Vector.sub(desPos, mouse);

    if(des.mag() < 10){
      dragging = true;
      offX = des.x;
      offY = des.y;

      draggedPoint = c;
    }
  }
}

function keyPressed(){
  if(keyCode == CONTROL){
    isNewPoint = true;
  }
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