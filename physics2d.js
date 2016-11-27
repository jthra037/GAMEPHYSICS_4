//////////////////////////////////////////////////////////////////////
// 
// Copyright (C) 2016
// Author: Ilir Dema
// Version 2.0 Nov 12, 2016
//
//////////////////////////////////////////////////////////////////////
//
// Physcis modules
//
function particleToLine(p,v,line) {
	// compute the time of a point with initial position p
	// moving with velocity vector v, hits a line 
    
	var fromLine = Vec(line.point,p);
	var perp = line.dirVec.perp();
	var vComp = dotprod(fromLine,perp);
	if(vComp < -Number.MIN_VALUE)
		perp = new vec2d(-perp.x,-perp.y);
	
	vComp = dotprod(v,perp);
	if(vComp >= Number.MIN_VALUE) 
		return Number.POSITIVE_INFINITY;
	
	var mat = new mat2d(v.x,-line.dirVec.x,v.y,-line.dirVec.y);
	var dmat = mat.det();
    var matInv = new mat2d(-line.dirVec.y/dmat,line.dirVec.x/dmat,-v.y/dmat,v.x/dmat);
    var time = matInv.mat[0][0]*(p.x-line.point.x)+matInv.mat[0][1]+(p.y-line.point.y);
	return time;
}

 // colliding circles moving on a straight line
	 function circleCircleStraightCollision(circle1, circle2, v1, v2) {
	 
		var d = circle1.center.dist(circle2.center);
		var minDist = circle1.radius + circle2.radius;
		if(d <= minDist)
		    return Number.MIN_VALUE;
		var relVelocity = v1.add(v2.mul(-1));
		var cVec = Vec(circle1.center,circle2.center);
	    if (Math.abs(dotprod(relVelocity,cVec)/cVec.length()/relVelocity.length()+1) <= Number.MIN_VALUE)
	        return Number.POSITIVE_INFINITY;
	    var relspeed = relVelocity.length();
		return (d-minDist)/relspeed;
	 }

	 function intersectionTime(p1, v1, p2, v2) {
        // compute intersection time for points p1,p2
        // moving with velocities v1, v2 
        var con1 = p2.x - p1.x;
        var con2 = p2.y-p1.y;
        var det = v1.y*v2.x-v1.x*v2.y;
		var con = v2.x*con2-v2.y*con1;
		if (Math.abs(det) <= Number.MIN_VALUE)
			return Number.POSITIVE_INFINITY;
		else 
			return  con/det;
	 }
	  
function circleWallCollision(circle, wall, velocity) {
	    // circle -> circle object(center,radius)
		// wall -> the wall boundary line (point, dirVec)
	    // by convention, dirVec.perp is directed opposite to the solid side
		// that means (dirVec, dirVec.perp) is right handed
        var n = wall.dirVec.perp();
		var a = Vec(wall.point,circle.center);
		var c = dotprod(a,n);
		if(Math.abs(c) < circle.radius) 
			return Number.MIN_VALUE; // embedded
		var r;
		if(c < -Number.MIN_VALUE) 
			r = n.mul(circle.radius);
		else
			r = n.mul(-circle.radius);
		var collision = dotprod(n,velocity);
		if (collision >= Number.MIN_VALUE)
			return Number.POSITIVE_INFINITY;
		var p = circle.center;
		p.x = p.x + r.x;
		p.y = p.y + r.y;
		var time = intersectionTime(p,v,wall.point,wall.dirVec);
		return time;
	 }
	 
	 function circleSegmentCollision(circle, wall, p1, p2, velocity) {
		var n = wall.dirVec.perp();
		var a = Vec(wall.point,circle.center);
		var c = dotprod(a,n);
		if(Math.abs(c) < circle.radius) 
			return Number.MIN_VALUE; // embedded
		var r;
		if(c < -Number.MIN_VALUE) 
			r = n.mul(circle.radius);
		else
			r = n.mul(-circle.radius);
		var collision = dotprod(n,velocity);
		if (collision >= Number.MIN_VALUE)
			return Number.POSITIVE_INFINITY;
		var p = circle.center;
		p.x = p.x + r.x;
		p.y = p.y + r.y;
		var time = intersectionTime(p,velocity,wall.point,wall.dirVec);
		if (time == Number.POSITIVE_INFINITY)
			return time;
		// Compute position of p at intersection time
		p.x = p.x + time*velocity.x;
		p.y = p.y + time*velocity.y;
		// check if p is inside (p1,p2)
		var dp = dotprod(Vec(p1,p2),Vec(p1,p));
		var dp1p2 = p1.dist(p2);
		var dsquared = dp1p2*dp1p2;
	    if (dp > 0 && dp <= dsquared)
            return time;
        else {
			var dmin = Math.min(p1.dist(p),p2.dist(p));
			if (dmin > circle.radius)
				return Number.POSITIVE_INFINITY; // no collision
			else {
				var d1 = Math.sqrt(circle.radius*circle.radius-dmin*dmin);
				var vel = Math.abs(dotprod(velocity,n));
				var addTime = (circle.radius-d1)/vel;
				time = time+addTime;
				return time;
			}
		}		
	 }
	 
	 