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
	var rotSpeed = 0;

	var height, width, heightHalf, widthHalf, fieldOfView,aspectRatio,nearPlane, farPlane;
	init();
	draw();

	function init(){
		//init variables
		console.log("Init Sketch function");
		height = window.innerHeight;
		width = window.innerWidth;
		heightHalf = height/2-50;
		widthHalf = width/2-50;
		fieldOfView = 60;
		aspectRatio = width / height;
		nearPlane = 1;
		farPlane = 2000;
		cameraZ = 150;
		boundaryAxis = heightHalf-50;
		mouseX = 0,
  	mouseY = 0,
		pi2 = Math.PI/2;

		//create the scene and camera for the scene
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera( fieldOfView, aspectRatio, nearPlane, farPlane );
		camera.position.x = 100;
		camera.position.y = 100;
		camera.position.z = cameraZ;

		//Create a container to add to the document
		container = document.createElement('div');
		container.id = "sketch";
		document.body.appendChild(container);
		document.body.style.margin = 0;
		document.body.style.overflow = 'hidden';

		//create a visual axis of the planes
		axis = makeAxis(boundaryAxis);
		scene.add(axis);

		//Create and add the renderer to the constainer element
		renderer = new THREE.WebGLRenderer();
		renderer.domElement.style.position = 'absolute';
		renderer.domElement.style.top = '0px';
    renderer.domElement.style.right = '0px';
		renderer.domElement.style.zindex = '1';
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
		addEventListeners();

		rotationChange();
		getRandomPoints(); //by default get random points and display them

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

		//rotate scene
		scene.rotation.x += rotSpeed;
		scene.rotation.y += rotSpeed;
		scene.rotation.z += rotSpeed;
    camera.lookAt(scene.position);
		//loop through rendered objects in scene
		for (i = 0; i < scene.children.length; i++) {
          var object = scene.children[i];
					// object.rotation.x += rotSpeed;
					// object.rotation.y += rotSpeed;
					// object.rotation.z += rotSpeed;
          if (object instanceof THREE.Points) {
						//if object is a points mesh
          }
        }
		renderer.render(scene, camera);
	}
	function addEventListeners(){
		document.getElementById('clear').addEventListener('click', clearScene);
		document.getElementById('quickHull').addEventListener('click', showQuickHull);
		document.getElementById('grahamScan').addEventListener('click', showGrahamScan);
		document.getElementById('points').addEventListener('click', getCustomPoints);
		document.getElementById('pointsrandom').addEventListener('click', getRandomPoints);
		document.getElementById('toggleAxis').addEventListener('click', toggleAxis);
		document.getElementById('delaunayConstruction').addEventListener('click', delaunayConstruction);
		document.getElementById('dropbutton').addEventListener('click', toggleDropDownContent);

		document.getElementById('clear').addEventListener('touchstart', clearScene);
		document.getElementById('quickHull').addEventListener('touchstart', showQuickHull);
		document.getElementById('grahamScan').addEventListener('touchstart', showGrahamScan);
		document.getElementById('points').addEventListener('touchstart', getCustomPoints);
		document.getElementById('pointsrandom').addEventListener('touchstart', getRandomPoints);
		document.getElementById('toggleAxis').addEventListener('touchstart', toggleAxis);
		document.getElementById('delaunayConstruction').addEventListener('touchstart', delaunayConstruction);
		document.getElementById('dropbutton').addEventListener('touchstart', toggleDropDownContent);
		document.getElementById('rotSpeed').addEventListener('change',rotationChange);
		//add event listeners to the page
		window.addEventListener('resize', onWindowResize, false);
		document.addEventListener('mousemove', onMouseMove, false);
		document.addEventListener('mousedown', onMouseDown, false);
		document.addEventListener('mouseup', onMouseUp, false);
		//document.addEventListener('touchstart', onTouchStart, false); //for mobile
		document.addEventListener('touchmove', onTouchMove, false); //for mobile
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
	function getRandomPoints(){
		var sz = document.getElementById("size").value;
		var n = new String(document.getElementById("n").value.toString());
		var xmax = new String(document.getElementById("xmax").value.toString());
		var xmin = new String(document.getElementById("xmin").value.toString());
		var ymax = new String(document.getElementById("ymax").value.toString());
		var ymin = new String(document.getElementById("ymin").value.toString());
		var zmax = new String(document.getElementById("zmax").value.toString());
		var zmin = new String(document.getElementById("zmin").value.toString());
		var xfunc = replaceFunctions(new String("(("+xmax +"*2)* rand )+ " + xmin));
		var yfunc = replaceFunctions(new String("(("+ymax +"*2)* rand )+ " + ymin));
		var zfunc = replaceFunctions(new String("(("+zmax +"*2)* rand )+ " + zmin));
		var x = function(t){return eval(xfunc.toString()); };
		var y = function(t){return eval( yfunc.toString()); };
		var z = function(t){return eval(zfunc.toString()); };
		pointsObj = makeParametricPoints(sz, 1, n, 0, x,y,z);
		clearScene();
		scene.add(pointsObj);
		pointSet = [];
		for(var i = 0; i < pointsObj.geometry.vertices.length; i++){
			pointSet.push(pointsObj.geometry.vertices[i]);
		}

	}
	function getCustomPoints(){
			var sz = document.getElementById("size").value;
			var a = new String(document.getElementById("a").value.toString());
			var xmax = new String(document.getElementById("xmax").value.toString());
			var xmin = new String(document.getElementById("xmin").value.toString());
			var ymax = new String(document.getElementById("ymax").value.toString());
			var ymin = new String(document.getElementById("ymin").value.toString());
			var zmax = new String(document.getElementById("zmax").value.toString());
			var zmin = new String(document.getElementById("zmin").value.toString());
			var xfunc =  new String(document.getElementById("xfunc").value.toString());
			var yfunc =  new String(document.getElementById("yfunc").value.toString());
			var zfunc =  new String(document.getElementById("zfunc").value.toString());
			var increment = eval(replaceFunctions(new String(document.getElementById("increment").value.toString())));
			var tmax =  eval(replaceFunctions(document.getElementById("tmax").value.toString()));
			var tmin = eval(replaceFunctions(document.getElementById("tmin").value.toString()));

			if(/rand/.test(xfunc)){ //add boundaries if user is using random func
				xfunc = (new String("(("+xmax +"*2)*" + xfunc + ")+ " + xmin));
			}
			if(/rand/.test(yfunc)){
				yfunc = (new String("(("+ymax +"*2)*" + yfunc + ")+ " + ymin));
			}
			if(/rand/.test(zfunc)){
				zfunc = (new String("(("+zmax +"*2)*" + zfunc + ")+ " + zmin));
			}


			//make subs from user input to js syntax,
			//sin becomes Math.sin , rand becomes MAth.random() etc
			xfunc = replaceFunctions(xfunc);
			yfunc = replaceFunctions(yfunc);
			zfunc = replaceFunctions(zfunc);
			//parametric functions for point dimension

			 var x = function(t){return eval(xfunc.toString()); };
			 var y = function(t){return eval( yfunc.toString()); };
			 var z = function(t){return eval(zfunc.toString()); };

			clearScene();

			pointsObj = makeParametricPoints(sz, increment, tmax, tmin, x,y,z);
			scene.add(pointsObj);
			pointSet = [];
			for(var i = 0; i < pointsObj.geometry.vertices.length; i++){
				pointSet.push(pointsObj.geometry.vertices[i]);
			}
	}
	function replaceFunctions(source){
		source = source.replace(/sin/ig,"Math.sin");
		source = source.replace(/tan/ig,"Math.tan");
		source = source.replace(/cos/ig,"Math.cos");
		source = source.replace(/sqrt/ig,"Math.sqrt");
		source = source.replace(/rand/ig,"Math.random()");
		source = source.replace(/pi/ig,"Math.PI");
		return source;
	}
	function showGrahamScan(){
		//algorithm destroys array so pass a copy over
		var points = [];
		for(var i = 0; i < pointSet.length;i++){
			points.push(pointSet[i]);
		}
		grahamScanObj = grahamScan(points);
		scene.add(grahamScanObj.lines);
		//scene.add(grahamScanObj.path);
		scene.add(grahamScanObj.hull);

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

	function makeParametricPoints(sz, increment, pmax, pmin ,x, y, z){
		var d = 3; //dimension
		var geometry = new THREE.Geometry();
		var increment = (parseFloat(increment));
		//Creates shape meshes to add to the scene
		for(var deg = pmin; deg < pmax; deg += increment){
			var pt = [ x(deg), y(deg),z(deg)];
			var vec = new THREE.Vector3(pt[0], pt[1],pt[2]);
			geometry.vertices.push(vec);
		}
		var points = new THREE.Points( geometry, new THREE.PointsMaterial( {size: sz}));
		return points; //add to scene
	}

	function makeBox(w,h,d){
		return new THREE.Mesh(
	    new THREE.BoxGeometry( w, h, d ),
	    new THREE.MeshFaceMaterial({wireframe : true, color: 0xff8888}));
	}
	function findMinY(points){
		var minIndex = 0; //find point with smallest y and swap it with points[0]
		for(var i = 0 ; i< points.length; i++){
			if(points[i].y < points[minIndex].y){
				minIndex = i;
			}
		}
		return {point: points[minIndex],
						index : minIndex};
	}
	function triangulate(points){
		return delaunayConstruction(points);
	}
	function delaunayConstruction(points){
		//for each pi,pj,pk,pl , a tetrahedron (p) exists
		//if if no other points are within the sphere located a centroid of tetrahedron
	}
	function grahamScan(points){
		if(!points || points.length < 0){
			return null;
		}

		var geometryPath = new THREE.Geometry(); //shows how points where traversed
		var geometryLine = new THREE.Geometry(); //shows each point vector line from origin, min point
		var geometryHull = new THREE.Geometry();

		var min = findMinY(points);
		var minIndex = min.index;
		var minPt = min.point;
		points.splice(minIndex, 1); //remove minY point from set
		points = sortByPolar(minPt, points);
		var prev = new THREE.Vector3(points[0].x,points[0].y,points[0].z);
		var cur = new THREE.Vector3(points[1].x,points[1].y,points[1].z);
		geometryPath.vertices.push(minPt); //min y will be on hull
		geometryPath.vertices.push(prev);
		geometryPath.vertices.push(cur);
		//push first three points
		geometryHull.vertices.push(minPt); //min y will be on hul
		geometryHull.vertices.push(prev); //pushed on hull stack
		geometryHull.vertices.push(cur); //pushed on hull stack


		for(var i = 2; i < points.length; i++){
			prev = new THREE.Vector3(points[i-1].x,points[i-1].y,points[i-1].z);
			cur = new THREE.Vector3(points[i].x,points[i].y,points[i].z);
			//add points to lines, and path
			geometryLine.vertices.push(minPt); //min y will be on hull
			geometryLine.vertices.push(cur);
			geometryPath.vertices.push(prev);
			geometryPath.vertices.push(cur);


			//find next point to add to the hull if next is availabl
			//while not ccw, pop the top of geometry stack and test the new current with the current construction of hull
			while( orientation(geometryHull.vertices[geometryHull.vertices.length-1],
				                         geometryHull.vertices[geometryHull.vertices.length-2],
																 cur) <=  0){
				geometryHull.vertices.splice(geometryHull.vertices.length-1,1);

			}			//while orientation is not counterclockwise
			//current is valid if counter clockwise
			geometryHull.vertices.push(cur);

		}

		geometryHull.vertices.push(minPt); //wrap line geometry around to beginning

		var lines =  new THREE.Line(geometryLine, new THREE.LineBasicMaterial({color : 0x248f8f}));
		var path =  new THREE.Line(geometryPath, new THREE.LineBasicMaterial({color: 0x6660ff}));
		var hull =  new THREE.Line(geometryHull, new THREE.LineBasicMaterial({color: 0xe89dd8}));
		return {lines : lines,
						path : path,
					hull: hull};
		}
	function orientation(a,b,c){
		//if return > 0 then counterclockwise
		//if return < 0 then clockwise
		//if return == 0 then collinear
		return (b.x - a.x)*(c.y - a.y) - (b.y - a.y)*(c.x - a.x)
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
		//points that make up convex hull
		var convexSet = new THREE.Points(hullGeometry, new THREE.PointsMaterial({size : 7,color: 0x007f88}));

		var lineGeometry = new THREE.Geometry();
			if(convexSet.geometry.vertices.length > 0){
			//TODO
			//find minxy
			var min = findMinY(convexSet.geometry.vertices);
			//sort points by polar of min and get the path taken of the points when traversing
			var sortedPoints = sortByPolar(min.point, convexSet.geometry.vertices);
			//connect the hull by travelling path of polar sorted points
			for(var i = 0; i < sortedPoints.length; i++){
				//lineGeometry.vertices.push(sortedPoints[i]);
				prev = sortedPoints[i];
			}
		}
		var lines = new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({color: 0x818333}));

		return {
			points: convexSet,
			lines : lines
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
			 for (var i = 0; i < points.length; i++){
				 if(!isInTriangle(points[i], pA,pB, maxPt)){
					 //if the determinant of point if less than zero, on left of line
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
		height = window.innerHeight;
		width = window.innerWidth;
		widthHalf = width/2;
		heightHalf = height/2;
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(width, height);
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
    if (e.touches.length === 1 && e.touches[0] != "dropbutton" &&e.touches[0] != "dropdown-content") {
        mouseX = e.touches[0].pageX - widthHalf;
        mouseY = e.touches[0].pageY - heightHalf;
      }
	}
	function onTouchStart(e){
		if (e.touches.length === 1 && e.touches[0] != "dropbutton" &&e.touches[0] != "dropdown-content") {
			 mouseX = e.touches[0].pageX - widthHalf;
			 mouseY = e.touches[0].pageY - heightHalf;
	 }
	}
	function toggleAxis(){
		if(axis == null){
			axis = makeAxis(boundaryAxis);
			scene.add(axis);
		}else{
			for (let i = scene.children.length - 1; i >= 0 ; i--) {
		    let child = scene.children[ i ];
		    if ( child == axis) { // plane & camera are stored earlier
		      scene.remove(child);
		    }
	  	}
			axis = null;
		}
	}
	function toggleDropDownContent(){
		var content = document.getElementsByClassName('dropdown-content');
		for(var i = 0; i < content.length; i++){
			if(content[i].style.display == 'block'){
				content[i].style.display = 'none';
			}else{
				content[i].style.display = 'block';
			}
		}
	}
	function rotationChange(){
		rotSpeed = eval(document.getElementById('rotSpeed').value.toString())/1000;
	}
});
