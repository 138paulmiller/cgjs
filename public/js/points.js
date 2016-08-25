var points = function(){
  var object = {};

  object.makePoints = function(n, sz, x,y,z, xVelocity, yVelocity, zVelocity, inc=0.1, xRange=[0,100], yRange=[0,100], zRange=[0,100],dynamic=true){
    var geometry = new THREE.Geometry();
    for(var i = 0 ; i < n; i++){
      geometry.vertices.push(new THREE.Vector3(x(inc), y(inc), z(inc)));
      geometry.colors.push(new THREE.Color((Math.sin(i)*512)-256, (Math.cos(i)*512)-256, (Math.sin(i)*512)-256));
    }
    geometry.velocity = [xVelocity, yVelocity, zVelocity];
    geometry.dynamic = dynamic;
    geometry.xRange = xRange;
    geometry.yRange = yRange;
    geometry.zRange = zRange;
    geometry.increment = inc;
    var pointsObj = new THREE.Points(geometry, new THREE.PointsMaterial({vertexColors: THREE.VertexColors, size: sz}));;
    pointsObj.update = function (){
      var t = 0;
      for(var j = 0; j < this.geometry.vertices.length; j++){
        this.geometry.vertices[j].x += this.geometry.velocity[0](t);
        this.geometry.vertices[j].y += this.geometry.velocity[1](t);
        this.geometry.vertices[j].z += this.geometry.velocity[2](t);
        this.geometry.vertices[j].x %= this.geometry.xRange[1];
        this.geometry.vertices[j].y %= this.geometry.yRange[1];
        this.geometry.vertices[j].z %= this.geometry.zRange[1];
        t+=this.geometry.increment;
      }
      this.geometry.verticesNeedUpdate = true;
    };
    pointsObj.update();
    console.log(pointsObj);
    return pointsObj;
  };

  return object;
};
