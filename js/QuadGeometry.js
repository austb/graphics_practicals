var QuadGeometry = function(gl, vertices) {
  this.gl = gl;
  this.vertices = new Vec3Array(4);
  this.vertices[3].set(new Vec3(1, 1, 0.0));
  this.vertices[2].set(new Vec3(1, -1, 0.0));
  this.vertices[1].set(new Vec3(-1, 1, 0.0));
  this.vertices[0].set(new Vec3(-1, -1, 0.0));

  this.vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER,
      this.vertices.storage,
    gl.STATIC_DRAW);

  this.vertexNormalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array([
       0, 0, 1,
       0, 0, 1,
       0, 0, 1,
       0, 0, 1,
    ]),
    gl.STATIC_DRAW);

  this.vertexTexCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTexCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array([
      0, 1,
      0, 0,
      1, 1,
      1, 0,
    ]),
    gl.STATIC_DRAW);

  this.indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array([
      0, 1, 2,
      1, 2, 3,
    ]),
    gl.STATIC_DRAW);
}; // QuadGeometry constructor ends here


QuadGeometry.prototype.draw = function() {
  var gl = this.gl;
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0,
    3, gl.FLOAT, //< three pieces of float
    false, //< do not normalize (make unit length)
    0, //< tightly packed
    0 //< data starts at array start
  );

  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1,
    3, gl.FLOAT, //< three pieces of float
    false, //< do not normalize (make unit length)
    0, //< tightly packed
    0 //< data starts at array start
  );

  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTexCoordBuffer);
  gl.enableVertexAttribArray(2);
  gl.vertexAttribPointer(2,
    2, gl.FLOAT, //< two pieces of float
    false, //< do not normalize (make unit length)
    0, //< tightly packed
    0 //< data starts at array start
  );

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
};
