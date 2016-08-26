var points = function(){
  var object = {};

  object.makeDynamicParametricPoints = function(n, sz, x,y,z, xVelocity, yVelocity, zVelocity, xRange=[-50,50], yRange=[-50,50], zRange=[-50,50],inc=0.01,loop=true, reflect=true){
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
    geometry.xRange = xRange;
    geometry.yRange = yRange;
    geometry.zRange = zRange;
    geometry.increment = inc;
    geometry.wrap = loop;
    geometry.reflect= reflect;

    var pointsObj = new THREE.Points(geometry, new THREE.PointsMaterial({vertexColors: THREE.VertexColors, size: sz}));;
    pointsObj.update = function (){
      var t = 0;
      for(var j = 0; j < this.geometry.vertices.length; j++){
        if(this.geometry.vertices[j].draw == true){
          this.geometry.vertices[j].x += this.geometry.vertices[j].velocity[0];
          this.geometry.vertices[j].y += this.geometry.vertices[j].velocity[1];
          this.geometry.vertices[j].z += this.geometry.vertices[j].velocity[2];

          if(this.geometry.vertices[j].x  > this.geometry.xRange[1] || this.geometry.vertices[j].x  < this.geometry.xRange[0]){
            if(this.geometry.vertices[j].y  > this.geometry.yRange[1] || this.geometry.vertices[j].y  < this.geometry.yRange[0]){
              if(this.geometry.vertices[j].z  > this.geometry.zRange[1] || this.geometry.vertices[j].z  < this.geometry.zRange[0]){
                if(reflect){
                  this.geometry.vertices[j].velocity[0] *= (-1.0);
                  this.geometry.vertices[j].velocity[1] *= (-1.0);
                  this.geometry.vertices[j].velocity[2] *= (-1.0);
                }else if(loop){
                  this.geometry.vertices[j].x = this.geometry.parametrics[0](0);
                  this.geometry.vertices[j].y = this.geometry.parametrics[1](0);
                  this.geometry.vertices[j].z = this.geometry.parametrics[2](0);
                }else{
                  this.geometry.vertices[j].dynamic = false;
                }
              }
            }
          }
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
