/*

-paul miller
138paulmiller@gmail.com
*/
var sketch = (function (){
	var scene, axis, camera, renderer;
	var pointSet, pointsObj, grahamScanObj, quickHullObj;
	var statsIndicator;
	var mouseX, mouseY;
	var pi2;
	var mouseDown = false;

	var height, width, heightHalf, widthHalf, fieldOfView,aspectRatio,nearPlane, farPlane;
	var boundaryX, boundaryY;
	init();
	draw();

	function init(){
		console.log("Sketch function");
		height = window.innerHeight;
		width = window.innerWidth;
		heightHalf = height/2-50;
		widthHalf = width/2-50;
		fieldOfView = 60;
		aspectRatio = width / height;
		nearPlane = 1;
		farPlane = 2000;
		cameraZ = 150;
		boundaryX = heightHalf-50;
		boundaryY = heightHalf-50;
		boundaryAxis = heightHalf-50;
		mouseX = 0,
  	mouseY = 0,
		pi2 = Math.PI/2;

		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera( fieldOfView, aspectRatio, nearPlane, farPlane );
		camera.position.x = 100;
		camera.position.y = 100;
		camera.position.z = cameraZ;

		//Create a container to add to the document
		container = document.createElement('div');
		document.body.appendChild(container);
		document.body.style.margin = 0;
		document.body.style.overflow = 'hidden';

		//create a visual axis of the planes
		axis = makeAxis(boundaryAxis);
		scene.add(axis);

		//add the renderer to the constainer element
		renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(width, height);

    container.appendChild(renderer.domElement);
		//append the statsIndicator element to the top right of the container
		statsIndicator = new THREEx.RendererStats();
    statsIndicator.domElement.style.position = 'absolute';
    statsIndicator.domElement.style.top = '5px';
    statsIndicator.domElement.style.right = '5px';
    container.appendChild(statsIndicator.domElement);

		//add listeners to buttons
		document.getElementById('clear').addEventListener('click', clearScene);
		document.getElementById('quickHull').addEventListener('click', showQuickHull);
		document.getElementById('grahamScan').addEventListener('click', showGrahamScan);
		document.getElementById('points').addEventListener('click', showPoints);
		//add event listeners to the page
		window.addEventListener('resize', onWindowResize, false);
		document.addEventListener('mousemove', onMouseMove, false);
		document.addEventListener('mousedown', onMouseDown, false);
		document.addEventListener('mouseup', onMouseUp, false);
		document.addEventListener('touchstart', onTouchStart, false); //for mobile
		document.addEventListener('touchmove', onTouchMove, false); //for mobile
	}
	/*
		This is the animation (infinite  looping ) function
	*/
	function draw(){
		requestAnimationFrame(draw); //draw is animation call
		render(); //render three objects
		//show statsIndicator of computer between renders
		statsIndicator.update(renderer);
	}
/*
	Repeatedly draws the threejs objectss
*/
function render() {
		camera.position.x += (mouseX - camera.position.x) * .75;
    camera.position.y += (-mouseY - camera.position.y) * .75;
    camera.lookAt(scene.position);
		//loop through rendered objects in scene
		for (i = 0; i < scene.children.length; i++) {
          var object = scene.children[i];
          if (object instanceof THREE.Points) {
						//if object is a points mesh
          }
        }
		renderer.render(scene, camera);
	}
	function clearScene(){
		delete pointsObj;
		delete grahamScanObj;
		delete quickHullObj;
		for (let i = scene.children.length - 1; i >= 0 ; i--) {
	    let child = scene.children[ i ];
	    if ( child != axis && child != camera) { // plane & camera are stored earlier
	      scene.remove(child);
	    }
  	}
	}
	function showPoints(){
			var sz = document.getElementById("size").value;
			var n = document.getElementById("n").value;
			var r = 100;
			var r2 = r/2;

			//parametric functions for point dimension
			 var x = function(p){return (Math.random() * (boundaryX*2)) - (boundaryX);};
			 var y = function(p){return (Math.random() * (boundaryY*2)) - (boundaryY);};
			 var z = function(p){return 0;};

			clearScene();

			pointsObj = makePoints(n, sz, Math.PI/16,x,y,z);
			scene.add(pointsObj);
			pointSet = [];
			for(var i = 0; i < pointsObj.geometry.vertices.length; i++){
				pointSet.push(pointsObj.geometry.vertices[i]);
			}
	}
	function showGrahamScan(){
		//algorithm destroys array so pass a copy over
		var points = [];
		for(var i = 0; i < pointSet.length;i++){
			points.push(pointSet[i]);
		}
		grahamScanObj = grahamScan(points);
		scene.add(grahamScanObj.lines);
		scene.add(grahamScanObj.path);
	}
	function showQuickHull(){
		//algorithm destroys array so pass a copy over
		var points = [];
		for(var i = 0; i < pointSet.length;i++){
			points.push(pointSet[i]);
		}
		quickHullObj = quickHull(points);
		scene.add(quickHullObj.points);
		scene.add(quickHullObj.lines);
	}
	function makeAxis(planeheight){
		var geometry = new THREE.Geometry();
		geometry.vertices.push(new  THREE.Vector3(planeheight,0,0)); //x axis line max
		geometry.vertices.push(new  THREE.Vector3(0,0,0));  //x axis line min
		geometry.colors[0] = geometry.colors[1] = new THREE.Color(255,0,0);//color line segment
		geometry.vertices.push(new  THREE.Vector3(0,planeheight,0)); //y axis line max
		geometry.vertices.push(new  THREE.Vector3(0,0,0));  //x axis line min
		geometry.colors[2] = geometry.colors[3] = new THREE.Color(0,255,0); //color line segment
		geometry.vertices.push(new  THREE.Vector3(0,0,planeheight)); //z axis line max
		geometry.vertices.push(new  THREE.Vector3(0,0,0));  //x axis line min
		geometry.colors[4] = geometry.colors[5] = new THREE.Color(0,0,255); //color line segments

		return new THREE.Line(geometry, new THREE.LineBasicMaterial({vertexColors: THREE.VertexColors}), THREE.LineSegments);
	}

	function makePoints(n, sz, increment ,x, y, z){
		var d = 3; //dimension
		var geometry = new THREE.Geometry();
		var deg = 0;
		console.log(increment);
		//Creates shape meshes to add to the scene
		for(var i = 0; i < n; i++){
			var pt = [ x(deg), y(deg),z(deg)];
			var vec = new THREE.Vector3(pt[0], pt[1],pt[2]);
			geometry.vertices.push(vec);
			deg=(deg+increment);
		}
		var points = new THREE.Points( geometry, new THREE.PointsMaterial( {size: sz}));
		return points; //add to scene
	}

	function makeBox(w,h,d){
		return new THREE.Mesh(
	    new THREE.BoxGeometry( w, h, d ),
	    new THREE.MeshFaceMaterial({wireframe : true, color: 0xff8888}));
	}

	function grahamScan(points){
		if(points && points.length > 0){
			var minIndex = 0; //find point with smallest y and swap it with points[0]
			for(var i = 0 ; i< points.length; i++){
				if(points[i].x < points[minIndex].x &&
					points[i].y < points[minIndex].y){
					minIndex = i;
				}
			}
			var minY = points[minIndex];
			points.splice(minIndex, 1); //remove minY point from set
			points = sortByPolar(minY, points);
			var geometryPath = new THREE.Geometry();
			var geometryLine = new THREE.Geometry();
			var prev = new THREE.Vector3(minY.x,minY.y,0);

			for(var i = 0; i < points.length; i++){
				console.log("("+ points[i].x + "," + points[i].y + ")\n");
				geometryLine.vertices.push(new THREE.Vector3(minY.x,minY.y,0));
				geometryLine.vertices.push(new THREE.Vector3(points[i].x,points[i].y,0));
				geometryPath.vertices.push(prev);
				var cur =new THREE.Vector3(points[i].x,points[i].y,0);
				geometryPath.vertices.push(cur);
				prev = cur;
			}
			var lines =  new THREE.Line(geometryLine, new THREE.LineBasicMaterial({color : 0xf3f3f3}));
			var path =  new THREE.Line(geometryPath, new THREE.LineBasicMaterial({color: 0x6660ff}));

			return {lines : lines,
							path : path};
		}
	}
	function sortByPolar(a, points){
		return points.sort(function(b,c){
	    // compute the determinant
	    return (a.x*b.y) + (b.x*c.y) + (c.x*a.y) - (b.y*c.x) - (c.y*a.x) - (a.y*b.x);

		});
	}
	function quickHull(points){
	 	points = sortByX(points);
		//draw the line
		var geometryLine = new THREE.Geometry();
		var geometryPointAbove = new THREE.Geometry();
		var geometryPointBelow = new THREE.Geometry();

		//get furthest most points on x plane
		var a = points[0];
		var b = points[points.length-1];
		points.splice(0,1);
		points.splice(points.length-1,1);
		geometryLine.vertices.push(new THREE.Vector3(a.x, a.y, 0));
		geometryLine.vertices.push(new THREE.Vector3(b.x, b.y, 0));

		//remove them from the list
		//divide the rest of the points based of position relative to the line created by ab
		var partitionedSet = dividePointsByLine(points, a, b);

		for(var i = 0; i < partitionedSet.aboveSet.length; i++){
			geometryPointAbove.vertices.push(new THREE.Vector3(partitionedSet.aboveSet[i].x, partitionedSet.aboveSet[i].y, 0));
			geometryPointAbove.colors.push(new THREE.Color(0,0,255));
		}
		for(var i = 0; i < partitionedSet.belowSet.length; i++){
				geometryPointBelow.vertices.push(new THREE.Vector3(partitionedSet.belowSet[i].x, partitionedSet.belowSet[i].y, 0));
				geometryPointBelow.colors.push(new THREE.Color(0,255,0));
		}
		var line = new THREE.Line(geometryLine, new THREE.LineBasicMaterial({color: 0x00ff88}));
		var hullGeometry = new THREE.Geometry();
		var abovePoints = new THREE.Points( geometryPointAbove, new THREE.PointsMaterial( {size: 5, color : 0xff8888}));
		var belowPoints = new THREE.Points( geometryPointBelow, new THREE.PointsMaterial( {size: 5, color : 0x0018ff}));
		//hullGeometry.vertices.push(line.geometry.vertices[0]);
		findHull(abovePoints.geometry.vertices,a,b, hullGeometry.vertices);
		findHull(belowPoints.geometry.vertices,a,b, hullGeometry.vertices);

		//hullGeometry.vertices.push(line.geometry.vertices[1]);
		var points = new THREE.Points(hullGeometry, new THREE.PointsMaterial({size : 7,color: 0x007f88}));
		var hull = new THREE.Line(hullGeometry, new THREE.LineBasicMaterial({color: 0x818333}));
		return {
			points: points,
			lines : hull
		};
	}
	function findHull(points, pA, pB, hull){
		if(points && points.length > 0){
		/*calc hull of points*/
		/* for each p in points, create triangle a,b,p and find area,
		   if new area is larger then max update update */
			 var maxArea = 0;
			 var maxPt;
			 var t;
			 var areaOf = function(a,b,p){return (1/2)*Math.abs( (a.x - p.x )*(b.y-a.y) - (a.x-b.x)*(p.y-a.y) );};
			 for(var i = 0; i < points.length; i++){
				 t = areaOf(pA,pB,points[i]);
				 if(t > maxArea){
					 maxArea = t;
					 maxIndex = i;
				 }
			 }

			 maxPt = points[maxIndex];
			 points.splice(maxIndex,1);
			 //for the rest of the points, determine if inside triangle, if not
			 // determine if point is on right side of line, or left

			 var leftOutsidePoint = [];
			 var rightOutsidePoint = [];
			 //if inside triangle
			 // if point is right then x > maxPt.x else left
			 for (var i = 0; i < points.length; i++){
				 if(!isInTriangle(points[i], pA,pB, maxPt)){
					 //if the determinatnt of point if less than zero, on left of line
					 if((maxPt.x - pA.x)*(points[i].y - pA.y) - (maxPt.y - pA.y)*(points[i].x - pA.x) > 0){
						 rightOutsidePoint.push(points[i]);
					 }else{
						 leftOutsidePoint.push(points[i]);
					 }
				 }
			 }
			 //for drawing

 			 if(hull){
				 //if no points are outside triangle, add the edges containing maxpt
				 findHull(rightOutsidePoint, maxPt,pB, hull);
				 findHull(leftOutsidePoint, pA, maxPt, hull);

				 if(rightOutsidePoint.length <= 0 && leftOutsidePoint.length <= 0){
					 hull.push(new THREE.Vector3(pA.x,pA.y,0));
					 hull.push(new THREE.Vector3(maxPt.x,maxPt.y,0));
					 hull.push(new THREE.Vector3(pB.x,pB.y,0));
					 hull.push(new THREE.Vector3(maxPt.x,maxPt.y,0));
			 	}
 			}
	 	}
	}
	function isInTriangle(p, a,b,c){
		// barycentric coordinate system to solve,
		//if all s, t and 1-s-t ispositive, then p is in abc
		var area = 1/2*(-b.y*c.x + a.y*(-b.x + c.x) + a.x*(b.y - c.y) + b.x*c.y);
		var s = 1/(2*area)*(a.y*c.x - a.x*c.y + (c.y - a.y)*p.x + (a.x - c.x)*p.y);
		var t = 1/(2*area)*(a.x*b.y - a.y*b.x + (a.y - b.y)*p.x + (b.x - a.x)*p.y);
		return (s > 0 && t > 0 && (1-s-t) > 0);
	}
	function dividePointsByLine(points, pA, pB){
		/*for each point p determine
		  if the slope of pointA and )p (m) and
			compare it to the slope pointA and pointB(mAb).
			if m > mAb then above */
			var partitionedSet =  { aboveSet : [], belowSet : [] };
			var mAb = (pB.y - pA.y) /(pB.x - pA.x);
			for(var i = 0; i < points.length; i++){
				if(((points[i].y - pA.y) /(points[i].x - pA.x)) - mAb > 0){
					partitionedSet.aboveSet.push(points[i]);
				} else{
					partitionedSet.belowSet.push(points[i]);
				}
			}
			return partitionedSet;
	}
	function sortByX(points){
		points = points.sort(function (a,b){
			return a.x - b.x;
		});
		return points;
	}

	/*
	Event listeners*/
	function onWindowResize(e){

	}
	function onMouseMove(e){
		mouseX = e.clientX - heightHalf;
		mouseY = e.clientY - widthHalf;
	}
	function onMouseDown(e){
		mouseDown = true;
	}
	function onMouseUp(e){
		mouseDown = false;
	}
	function onTouchMove(e){

	}
	function onTouchStart(e){

	}
});





var maxIndex = 0;
