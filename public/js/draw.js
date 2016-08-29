/*

-paul miller
138paulmiller@gmail.com
*/

var drawer = function(){
  var container, renderer,scene, camera;
  var object = {};
  var sceneMap = {};
	var statsIndicator;
	var mouseX, mouseY;
	var pi2;
	var mouseDown = false;
	var rotX, rotY, rotZ = 0;
	var pointsShow;
	var height, width, heightHalf, widthHalf, fieldOfView,aspectRatio,nearPlane, farPlane;
  var clock = 0;
  init();
  run();

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
		farPlane = 1000;
		cameraZ = 300;
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
		container.id = "drawing";
		document.body.appendChild(container);
		document.body.style.margin = 0;
		document.body.style.overflow = 'hidden';

		//create a visual axis of the planes

		//Create and add the renderer to the constainer element
		renderer = new THREE.WebGLRenderer({preserveDrawingBuffer : true});
		renderer.domElement.style.position = 'absolute';
		renderer.domElement.style.top = '0px';
    renderer.domElement.style.right = '0px';
		renderer.domElement.style.zindex = '1';

    renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

		//add listeners to buttons
		addEventListeners();

	}
	/*
		This is the animation (infinite  looping ) function
	*/
	function run(){
		requestAnimationFrame(run); //draw is animation call
		render(); //render three objects
		//show statsIndicator of computer between renders
	}
/*
	Repeatedly draws the threejs objectss
*/
function render() {
		//rotate scene
    camera.lookAt(scene.position);
		//loop through rendered objects in scene
		for (i = 0; i < scene.children.length; i++) {
          var object = scene.children[i];
          if (object instanceof THREE.Points || object instanceof THREE.Mesh) {
						//if object is a points mesh
            object.update();
          }
        }

		renderer.render(scene, camera);
	}
	function addEventListeners(){
		//add event listeners to the page
		window.addEventListener('resize', onWindowResize, false);
		document.addEventListener('mousemove', onMouseMove, false);
		document.addEventListener('mousedown', onMouseDown, false);
		document.addEventListener('mouseup', onMouseUp, false);
		document.addEventListener('touchstart', onTouchStart, false); //for mobile
		document.addEventListener('touchmove', onTouchMove, false); //for mobile
    document.getElementById("dropbutton").addEventListener("touch", toggleDropdown);
    document.getElementById("dropbutton").addEventListener("click", toggleDropdown);
    document.getElementById("autoClear").addEventListener("click", toggleAutoClear);

	}

  /*Event listeners*/
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
    if (e.touches.length === 1  ) {
			e.preventDefault();
				mouseX = e.touches[0].pageX - widthHalf;
        mouseY = e.touches[0].pageY - heightHalf;
      }
	}
	function onTouchStart(e){
		if (e.touches.length == 1) {
			e.preventDefault();
			 mouseX = e.touches[0].pageX - widthHalf;
			 mouseY = e.touches[0].pageY - heightHalf;
	 }
	}
  function toggleDropdown(){
     var content = document.getElementsByClassName('dropdown-content');
     for(var i = 0; i < content.length; i++){
         if(content[i].style.display == 'block'){
           content[i].style.display = 'none';
         } else{
           content[i].style.display = 'block';
         }
     }
   }
   function toggleAutoClear(){
      if(document.getElementById("autoClear").checked){
        renderer.autoClear = false;
        renderer.clear();

      }else{
        renderer.autoClear = true;
      }

    }

  object.addObject = function(object, id){
    scene.add(object);
    sceneMap[id] = object;
  }

  object.getObject = function(id){
    return sceneMap[id];
  }

  object.renderer = function(){
    return renderer;
  }
  object.camera = function(){
    return renderer;
  }
  object.container = function(){
    return renderer;
  }
  object.scene = function(){
    return scene;
  }
  object.clearScene = function(){
    if(renderer.autoClear == false){
      renderer.autoClear = true;
      renderer.clear();
      renderer.autoClear = false;
      renderer.clear();
    }
		for (let i = scene.children.length - 1; i >= 0 ; i--) {
	    let child = scene.children[ i ];
	    if (child != camera) { // plane & camera are stored earlier
	      scene.remove(child);
	    }
  	}
	}
  return object;
}
