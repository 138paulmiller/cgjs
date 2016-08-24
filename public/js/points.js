var points = function(){
  var object = {};

  object.makePoints = function(n, sz, x,y,z){
    var geometry = new THREE.Geometry();
    for(var i = 0 ; i < n; i++){
      geometry.vertices.push(new THREE.Vector3(x(i), y(i), z(i)));
      geometry.colors.push(new THREE.Color(i%256, i*2%256, i/2%256));
    }
    return new THREE.Points(geometry, new THREE.PointsMaterial({vertexColors: THREE.VertexColor, size: sz}));;
  };
  return object;
};
