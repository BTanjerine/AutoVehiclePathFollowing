class Path{
    constructor(){
        this.points = [];   //node points of the path (the fist and last node points are control points)
        this.radius = 10;   //radius of the path (optional)
    }
    
    // calculate the points for the spline path
    // needs to be placed in a for loop!
    getSplinePoints(t){
        let p0, p1, p2, p3;

        p1 = floor(t)+1;
        p2 = p1+1;
        p3 = p2+1;
        p0 = p1-1;

        t = t - floor(t);

        let tt = t*t;
        let ttt = tt*t;

        let q1 = -ttt + 2.0*tt - t;
        let q2 = 3.0*ttt - 5.0*tt + 2.0;
        let q3 = -3.0*ttt + 4.0*tt + t;
        let q4 = ttt - tt;   
        
        let tx = 0.5*(this.points[p0].x*q1 + this.points[p1].x*q2 + this.points[p2].x*q3 + this.points[p3].x *q4);
        let ty = 0.5*(this.points[p0].y*q1 + this.points[p1].y*q2 + this.points[p2].y*q3 + this.points[p3].y *q4);

        return createVector(tx, ty);
    }

    //add new points on the path
    addPoint(newPoint){
        this.points.push(newPoint);
    }

    //delete points on path
    deletePoint(index){
        this.points.splice(index,1);
    }
}