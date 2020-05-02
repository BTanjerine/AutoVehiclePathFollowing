let i = 0;
class Robot{

  constructor(X,Y){
    this.x = X; //start coordinates of the robot
    this.y = Y;
    this.theta = 0; // in rads
    
    //position, velocity, and acceleration of the robot
    this.pos = createVector(this.x, this.y); 
    this.vel = createVector();
    this.acc = createVector();
    //max velocity and acceleration
    this.maxSpeed = 4;
    this.maxForce = 0.5;
  }

  // seek a specific target (cartesian point)
  // des: target the robot is following
  seek(des){
    let desPos = p5.Vector.sub(des, this.pos);  //find the desired pos vector
    let d = desPos.mag(); //get vector magnitude

    //adjust the velocity of the robot based on distance from point
    if(d < 50){
      let speed = map(d, 0, 50, 0, this.maxSpeed);
      desPos.setMag(speed);
    }
    else{
      desPos.setMag(this.maxSpeed); //just make the robot go full speed when distant from point
    }

    var handleForce = p5.Vector.sub(desPos, this.vel);  //create a force that pushes the robot to the desired point
    handleForce.limit(this.maxForce); //limit the force to max

    this.applyForce(handleForce); //apply the force to the robot
  }

  follow(pp, pathClass){
    let recordDist = 100000000; //really big number so it can easily be beaten
    let targetPos = null;
    let norm= null;

    let PA = 0;
    let PB = 0;

    //predict where the robot is going to be 
    let futurePoint = this.vel.copy();
    futurePoint.setMag(20); //extend
    let futurePos = p5.Vector.add(this.pos, futurePoint); //generate predicted point

    //scroll through all the path points (not nodes)
    for(let i=0; i<(float(paTH.points.length)-3.0)-0.005; i+=0.005){
      //find 2 points on the path (really close to each other)
      let pA = pp[i]; 
      let pB = pp[i+0.005];

      PA = pA;
      PB = pB;

      //find the point normal to the path on the path
      let normPoint = getNormalPoint(futurePoint, pA, pB); 

      //make sure the normal point is in range of the 2 points of the path
      let NtoA = p5.Vector.dist(normPoint,pA);
      let NtoB = p5.Vector.dist(normPoint,pB);
      let AtoB = p5.Vector.dist(pA,pB);

      if((NtoA + NtoB) == AtoB){
        normPoint = pB.copy();
        //console.log("work");
      }
      else{
        normPoint = pA.copy();
      }

      //find the distance of the future point to the normal point on the path
      let distance = p5.Vector.dist(normPoint,futurePos);

      //find the smallest distance for the robot to get back on track
      if(distance < recordDist){
        recordDist = distance;  //set a record distance (the closest to the path)
        norm = normPoint;

        //find a point ahead of the normal 
        let dir = p5.Vector.sub(pB, pA);
        dir.setMag(10); 

        //generate point on the path that the robot should follow
        targetPos = normPoint;
        targetPos.add(dir);
      }
    }
    
    if(i == 0){
      console.log(PA);
      console.log(PB);

      console.log(this.pos);

      console.log(futurePos);

      console.log(norm);
      console.log(targetPos);
      i++;
    }

    if(recordDist > 1 && targetPos != null){
      //follow this point
      this.seek(targetPos);
    }

    //for debugging to see normal point and futur points
    line(this.pos.x, this.pos.y, futurePos.x, futurePos.y);
    if(norm !== null){line(futurePos.x, futurePos.y, norm.x, norm.y);}
    fill(255, 0, 0);
    ellipse(targetPos.x, targetPos.y, 10);
  }
  
  //add a force to steer the robot
  applyForce(force){
    this.acc.add(force);
  }
  
  update(){
    //update robot vecotrs to control its pos, vel and acc
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);

    this.acc.mult(0); //reset the acceleration every loop
    
    //define the heading of the robot
    this.theta = this.vel.heading();
  }
  
  manifest(){
    //draw the robot
    rectMode(CENTER)
    
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.theta);
    
    noFill();
    rect(0, 0, 20, 40);
    pop();
  }

  run(){
    //let the robot run
    let mouse = createVector(mouseX, mouseY);

    this.update();
    this.manifest();
  }
}



//use scalar projection to find a point normal to the path
function getNormalPoint(AheadPoint, pointA, pointB){
  let a = p5.Vector.sub(AheadPoint, pointA);
  let b = p5.Vector.sub(pointB, pointA);

  b.normalize();
  b.setMag(a.dot(b)); //use dot product

  let n = p5.Vector.add(pointA, b);

  return n;
}