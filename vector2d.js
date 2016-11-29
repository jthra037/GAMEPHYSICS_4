//////////////////////////////////////////////////////////////////////
// 
// Copyright (C) 2016
// Author: Ilir Dema
//
//////////////////////////////////////////////////////////////////////
//
// Linear Algebra modules
//
function vec2d(x,y) {
	this.x = x;
	this.y = y;
	this.length = function() {
		return Math.sqrt(x*x+y*y);
	}
	this.add = function(other) {
		return new vec2d(this.x+other.x,this.y+other.y);
	}
	this.mul = function(scalar) {
		return new vec2d(scalar*this.x,scalar*this.y);
	}
	this.unit = function() {
		return new vec2d(this.x/this.length(),this.y/this.length());
	}
	
	this.perp = function() {
		// we ask that the pair (vec,perp) is right-handed pair
		return new vec2d(-this.unit().y,this.unit().x);
	}
}

function dotprod(vec1, vec2) {
	return vec1.x*vec2.x + vec1.y*vec2.y;
}

function angle(vec1, vec2) {
	var m = vec1.length()*vec2.length();
	if (m <= Number.MIN_VALUE)
		return 0;
	return Math.acos(dotprod(vec1,vec2)/m);
}

function mat2d(a,b,c,d) {
	this.mat = [[],[]];
	this.mat[0].push(a);
	this.mat[0].push(b);
	this.mat[1].push(c);
	this.mat[1].push(d);
	this.det = function() {
		return this.mat[0][0]*this.mat[1][1]-this.mat[1][0]*this.mat[0][1];
	}
}