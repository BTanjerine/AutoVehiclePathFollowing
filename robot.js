


class Robot{

  constructor(X,Y){
    this.x = X;
    this.y = Y;
    this.theta = 0; // in rads
    
    this.pos = createVector(this.x, this.y);
    this.vel = createVector();
    this.acc = createVector();

    this.maxSpeed = 3;
    this.maxForce = 0.1;
  }

  // seek a specific target
  // des: target the robot is following
  seek(des){
    let desPos = p5.Vector.sub(des, this.pos);
    let d = desPos.mag();

    if(d < 100){
      let speed = map(d, 0, 100, 0, this.maxSpeed);
      desPos.setMag(speed);
    }
    else{
      desPos.setMag(this.maxSpeed);
    }

    var handleForce = p5.Vector.sub(desPos, this.vel);
    handleForce.limit(this.maxForce);

    this.applyForce(handleForce);
  }

  follow(pp){
    let recordDist = 10000000; //really big number so it can easily be beaten
    let targetPos = null;
    let norm= null;

    let futurePoint = this.vel.copy();
    futurePoint.setMag(40);
    let futurePos = p5.Vector.add(this.pos, futurePoint);

    for(let i=0; i < (pathPoints.length+1.98499)-0.1; i+=0.005){
      let pA = pp[i];
      let pB = pp[i+0.005];

      let normPoint = getNormalPoint(futurePoint, pA, pB);

      if(normPoint.x < pA.x || normPoint.x > pB.x){
        normPoint = pB.copy();
      }

      let distance = p5.Vector.dist(futurePos, normPoint);

      //find the smallest distance for the robot to get back on track
      if(distance < recordDist){
        recordDist = distance;
        norm = normPoint;

        let dir = p5.Vector.sub(pB, pA);
        dir.setMag(10); //velocity 

        targetPos = normPoint.copy();
        targetPos.add(dir);
      }
    }

    if(recordDist > 1 && targetPos !== null){
      this.seek(targetPos);
    }

    console.log(targetPos);

    line(this.pos.x, this.pos.y, futurePos.x, futurePos.y);
    if(norm !== null){line(futurePos.x, futurePos.y, norm.x, norm.y);}
    fill(255, 0, 0);
    ellipse(targetPos.x, targetPos.y, 10);
  }
  
  applyForce(force){
    this.acc.add(force);
  }
  
  update(){
    
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);

    this.acc.mult(0); //reset the acceleration every loop
    
    this.theta = this.vel.heading();
  }
  
  manifest(){
    rectMode(CENTER)
    
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.theta);
    
    rect(0, 0, 20, 40);
    pop();
  }

  run(){
    let mouse = createVector(mouseX, mouseY);

    this.update();
    this.manifest();
  }
}

function getNormalPoint(AheadPoint, pointA, pointB){
  let a = p5.Vector.sub(AheadPoint, pointA);
  let b = p5.Vector.sub(pointB, pointA);

  b.normalize();
  b.setMag(a.dot(b));

  let n = p5.Vector.add(pointA, b);

  return n;
}