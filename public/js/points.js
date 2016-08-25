var points = function(){
  var object = {};

  object.makePoints = function(n, sz, x,y,z, dynamic=true){
    var geometry = new THREE.Geometry();
    for(var i = 0 ; i < n; i++){
      geometry.vertices.push(new THREE.Vector3(x(i), y(i), z(i)));
      geometry.colors.push(new THREE.Color((Math.sin(i)*512)-256, (Math.cos(i)*512)-256, (Math.sin(i)*512)-256));
    }
    geometry.dynamic = dynamic;
    return new THREE.Points(geometry, new THREE.PointsMaterial({vertexColors: THREE.VertexColors, size: sz}));;
  };

  return object;
};
