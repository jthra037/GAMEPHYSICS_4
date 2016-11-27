//////////////////////////////////////////////////////////////////////
// 
// Copyright (C) 2016
// Author: Ilir Dema
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
		return -1; // MAKES SURE IT CHECKS ALL THE SIDES AND DOESN'T STOP PREMATURELY
	
	var mat = new mat2d(v.x,-line.dirVec.x,v.y,-line.dirVec.y);
	var dmat = mat.det();
    var matInv = new mat2d(-line.dirVec.y/dmat,line.dirVec.x/dmat,-v.y/dmat,v.x/dmat);
    var time = matInv.mat[0][0]*(line.point.x-p.x)+matInv.mat[0][1]*(line.point.y-p.y);
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
function circleWallCollision(circle, wall, velocity) {
	    // circle -> circle object(center,radius)
		// wall -> the wall boundary line (point, dirVec)
	    // by convention, dirVec.perp is directed opposite to the solid side
		// that means (dirVec, dirVec.perp) is right handed
		var centerToWall = Vec(circle.center, wall.point); // vector tail=center, head=wall
		var wallNormal = wall.dirVec.perp();
		var proj = dotprod(centerToWall, wallNormal);
		if(Math.abs(proj) <= circle.radius) // CHANGED FROM < to <=
		   return 0; // circle already collided CHANGED FROM MIN_VALUE TO 0
		var r = wallNormal.mul(circle.radius);
		//
		// check if circle is approaching
		//
		var approach = dotprod(r,velocity);
		if (approach > Number.MIN_VALUE)
		   return -1; // circle is moving away
		//
		// compute time
		//
		var centreVec = Vec(new Point(0,0),circle.center);
		r = r.mul(-1);
		var toPointOfCollision = r.add(centreVec);
		var pointOfCollision = new Point(toPointOfCollision.x,toPointOfCollision.y);
		var time = particleToLine(pointOfCollision, velocity, wall);
		return time;
	 }
	 
	 
	 function circleSegmentCollision(circle, wall, p1, p2, velocity) {
	    // circle -> circle object(center,radius)
		// wall -> the wall boundary line (point, dirVec)
	    // by convention, dirVec.perp is directed opposite to the solid side
		// that means (dirVec, dirVec.perp) is right handed
		// p1, p2: two point on the wall, delimiting the segment
		var centerToWall = Vec(circle.center, wall.point); // vector tail=center, head=wall
		var wallNormal = wall.dirVec.perp();
		var proj = dotprod(centerToWall, wallNormal);
		if(Math.abs(proj) <= circle.radius) // CHANGED < to <= IN CASE IT IS CURRENTLY COLLIDING
		   return 0; // Return currently colliding
		var r = wallNormal.mul(circle.radius);
		//
		// check if circle is approaching
		//
		var approach = dotprod(r,velocity);
		if (approach > Number.MIN_VALUE)
		   return Number.POSITIVE_INFINITY; // circle is moving away
		// 
		// Stretch the segment p1-p2 by 2 diameters
		var p12 = Vec(p1,p2);
		var xd = Math.abs(2*circle.radius*dotprod(p12,new vec2d(1,0)));
		var yd = Math.abs(2*circle.radius*dotprod(p12,new vec2d(0,1)));
		if(p1.x < p2.x) {
				var x1 = p1.x-xd;
				var x2 = p2.x+xd;
			}
	    else {
			var x1 = p1.x+xd;
			var x2 = p2.x-xd;
		}
		if(p1.y < p2.y) {
				var y1 = p1.y-yd;
				var y2 = p2.y+yd;
			}
	    else {
			var y1 = p1.y+yd;
			var y2 = p2.y-yd;
		}
		if(x1 > x2) {
		   z = x1;
		   x1 = x2;
		   x2 = z;
		}
		if(y1 > y2) {
		   z = y1;
		   y1 = y2;
		   y2 = z;
		}
		//
		// compute time
		//
		var centreVec = Vec(new Point(0,0),circle.center);
		r = r.mul(-1);
		var toPointOfCollision = r.add(centreVec);
		var pointOfCollision = new Point(toPointOfCollision.x,toPointOfCollision.y);
		var time = particleToLine(pointOfCollision, velocity, wall);
		if ((pointOfCollision.x < x1 || pointOfCollision.x > x2) && (pointOfCollision.y < y1 || pointOfCollision.y > y2))
		    return -1 // MAKE SURE WE DON'T STOP CHECKING SEGMENTS PREMATURELY
		return time;
	 }
	 