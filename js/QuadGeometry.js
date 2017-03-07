var QuadGeometry = function(gl, vertices, material) {
  this.gl = gl;
  this.vertices = vertices;
  this.mat = material;

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
       0, 1, 1,
       1, 1, 1,
       1, 1, 0,
       1, 0, 0,
       1, 0, 1,
       0, 0, 0,
    ]),
    gl.STATIC_DRAW);

  this.vertexTexCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTexCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array([
      0, 0,
      0, 1,
      0, 1,
      0, 1,
      0, 1,
      0, 1,
      0, 1,
    ]),
    gl.STATIC_DRAW);

  this.indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array([
      0, 1, 2,
      0, 2, 3,
      0, 3, 4,
      0, 4, 5,
      0, 5, 6,
      0, 6, 1,
    ]),
    gl.STATIC_DRAW);

  this.lineIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.lineIndexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array([
      1, 2,
      2, 3,
      3, 4,
      4, 5,
      5, 6,
      6, 1,
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
  gl.drawElements(gl.TRIANGLES, 18, gl.UNSIGNED_SHORT, 0);

  this.mat.color.set(new Vec4(0.0, 0.0, 0.0, 1.0));
  this.mat.commit();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.lineIndexBuffer);
  gl.drawElements(gl.LINES, 12, gl.UNSIGNED_SHORT, 0);
};
