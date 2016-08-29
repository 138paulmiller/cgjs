

var points = function(){
  var object = {};

  object.makeDynamicParametricPoints = function(n, sz, x,y,z,
                                                xVelocity, yVelocity, zVelocity,
                                                rotX, rotY, rotZ,
                                                range=[-50,50],
                                                inc=Math.PI/16,loop=true, reflect=true){
    var geometry = new THREE.Geometry();
    var t = 0;
    var v;
    for(var i = 0 ; i < n; i++){
      v = new THREE.Vector3(x(t), y(t), z(t));
      v.draw = true;
      v.velocity = [xVelocity(t), yVelocity(t), zVelocity(t)];
      geometry.vertices.push(v);
      geometry.colors.push(new THREE.Color(Math.random()*t,Math.random(),Math.random()));
      t+= inc;
    }
    geometry.parametrics = [x, y, z];
    geometry.velocity = [xVelocity, yVelocity, zVelocity];
    geometry.dynamic = true;
    geometry.range = range;
    geometry.increment = inc;
    geometry.loop = loop;
    geometry.reflect= reflect;
    geometry.rotX= rotX;
    geometry.rotY= rotY;
    geometry.rotZ= rotZ;

    var pointsObj = new THREE.Points(geometry, new THREE.PointsMaterial({vertexColors: THREE.VertexColors, size: sz}));;
    pointsObj.update = function (){
      var t = 0;
      for(var j = 0; j < this.geometry.vertices.length; j++){
        if(this.geometry.dynamic == true){
          this.geometry.vertices[j].x += this.geometry.vertices[j].velocity[0];
          this.geometry.vertices[j].y += this.geometry.vertices[j].velocity[1];
          this.geometry.vertices[j].z += this.geometry.vertices[j].velocity[2];
          if(this.geometry.reflect){
              if(this.geometry.vertices[j].x  > this.geometry.range[1] || this.geometry.vertices[j].x  < this.geometry.range[0]){
                  this.geometry.vertices[j].velocity[0] *= -1.0;
              }
              if(this.geometry.vertices[j].y  > this.geometry.range[1] || this.geometry.vertices[j].y  < this.geometry.range[0]){
                this.geometry.vertices[j].velocity[1] *= -1.0;
              }
              if(this.geometry.vertices[j].z  > this.geometry.range[1] || this.geometry.vertices[j].z  < this.geometry.range[0]){
                this.geometry.vertices[j].velocity[2] *= -1.0;
              }
          }else{
            this.geometry.vertices[j].x =this.geometry.parametrics[0](0);
            this.geometry.vertices[j].y =this.geometry.parametrics[1](0);
            this.geometry.vertices[j].z =this.geometry.parametrics[2](0);
          }
        }//if draw
        t+=this.geometry.increment;
      }
      this.geometry.verticesNeedUpdate = true;
    };
    pointsObj.update();
    return pointsObj;
  }
  object.makeParametricPoints = function(n, sz, x,y,z, inc){
    var geometry = new THREE.Geometry();
    var t = 0;
    var v;
    for(var i = 0 ; i < n; i++){
      v = new THREE.Vector3(x(t), y(t), z(t));
      geometry.vertices.push(v);
      geometry.colors.push(new THREE.Color(i,i/4,i+20));
      t+= inc;
    }
    geometry.dynamic = false;
    var pointsObj = new THREE.Points(geometry, new THREE.PointsMaterial({vertexColors : THREE.VertexColors}));
    pointsObj.update = function(){};
    return pointsObj;
  };
  object.makeRingOfPoints = function(n, r, w){
    //create a set random points that are ecompassed within a ring, or
    var deg = 0;
    var inc = 0.2;
    var geometry = new THREE.Geometry();
    var bound = function(x){return (x*w*2-w);};
    for(var i = 0; i<n; i++){
      geometry.vertices.push(new THREE.Vector3(Math.cos(deg)*r+bound(Math.random()),
                                                Math.sin(deg)*r+bound(Math.random()),
                                                bound(Math.random())));
      geometry.colors.push(new THREE.Color(Math.random()*i,255/i,25));
      deg+=inc;
    }
    var pointsObj = new THREE.Points(geometry, new THREE.PointsMaterial({vertexColors : THREE.VertexColors}));
    pointsObj.update = function(){
      this.rotation.x += .01;
      this.rotation.y += .01;
    };

    return pointsObj;
  };
  object.makeCubeCloud = function(n, x,y,z){
    var cubeArray = [];
    for(var i = 0; i < n; i++){
      var rotX = Math.random()/10;
      var rotY = Math.random()/10;
      var rotZ = Math.random()/10;

      cubeArray.push(new THREE.Mesh(new THREE.BoxGeometry(10,10,10,10),
      new THREE.MeshNormalMaterial(Math.random())));
      cubeArray[i].position.x = x(i);
      cubeArray[i].position.y = y(i);
      cubeArray[i].position.z = z(i);
      cubeArray[i].update= function(){
        this.rotation.x += rotX;
        this.rotation.y +=rotY;
        this.rotation.y += rotZ;
      };
    }

    return cubeArray;
  };


  return object;
};
