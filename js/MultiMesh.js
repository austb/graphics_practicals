var MultiMesh = function(
    gl, jsonModelFileUrl, materials) {
  this.meshes = [];

  var request = new XMLHttpRequest();
  request.open("GET", jsonModelFileUrl);
  var theMultiMesh = this;
  request.onreadystatechange = function () {
    if (request.readyState == 4) {
      var meshesJson =
                JSON.parse(request.responseText).meshes;
      for (var i = 0; i < meshesJson.length; i++) {
        theMultiMesh.meshes.push( new Mesh(
         new IndexedTrianglesGeometry(gl, meshesJson[i]),
         materials[i]
        ));
      }
    }
  };
  request.send();
};


MultiMesh.prototype.draw = function(gl){
  for (var i = 0; i < this.meshes.length; i++) {
    this.meshes[i].draw(gl);
  }
};
