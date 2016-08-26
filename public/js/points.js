var points = function(){
  var object = {};

  object.makePoints = function(n, sz, x,y,z, xVelocity, yVelocity, zVelocity, xRange=[-50,50], yRange=[-50,50], zRange=[-50,50],inc=0.1,dynamic=true){
    var geometry = new THREE.Geometry();
    var t = 0;

    for(var i = 0 ; i < n; i++){
      geometry.vertices.push(new THREE.Vector3(x(t), y(t), z(t)));
      geometry.colors.push(new THREE.Color((Math.sin(Math.sin(i))*255), (Math.cos(Math.cos(i))*255), (Math.cos(Math.cos(i))*255)));
      t+= inc;
    }
    geometry.parametrics = [x, y, z];
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

        if(this.geometry.vertices[j].x  >= this.geometry.xRange[1] || this.geometry.vertices[j].x  <= this.geometry.xRange[0]){
          this.geometry.vertices[j].x = this.geometry.parametrics[0](t);
        }
        if(this.geometry.vertices[j].y  >= this.geometry.yRange[1] || this.geometry.vertices[j].y  <= this.geometry.yRange[0]){
            this.geometry.vertices[j].y = this.geometry.parametrics[1](t);
        }
        if(this.geometry.vertices[j].z  >= this.geometry.zRange[1] || this.geometry.vertices[j].z  <= this.geometry.zRange[0]){
              this.geometry.vertices[j].z = this.geometry.parametrics[2](t);
        }

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
