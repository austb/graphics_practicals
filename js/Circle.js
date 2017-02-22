var Circle = function(gl, circle) {
  this.gl = gl;

  this.positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array([
      (circle.x - circle.r), (circle.y - circle.r),
      (circle.x + (1 + Math.sqrt(2)) * circle.r), (circle.y - circle.r),
      (circle.x - circle.r), (circle.y + (1 + Math.sqrt(2)) * circle.r)
    ]),
    gl.STATIC_DRAW);

  this.centerBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.centerBuffer);
  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array([
      circle.x, circle.y,
      circle.x, circle.y,
      circle.x, circle.y
    ]),
    gl.STATIC_DRAW);


  this.radiusBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.radiusBuffer);
  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array([
      circle.r,
      circle.r,
      circle.r
    ]),
    gl.STATIC_DRAW);

}; // Circle constructor ends here


Circle.prototype.draw = function() {
  var gl = this.gl;

  gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0,
    2, gl.FLOAT, //< three pieces of float
    false, //< do not normalize (make unit length)
    0, //< tightly packed
    0 //< data starts at array start
  );

  gl.bindBuffer(gl.ARRAY_BUFFER, this.centerBuffer);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1,
    2, gl.FLOAT, //< two pieces of float
    false, //< do not normalize (make unit length)
    0, //< tightly packed
    0 //< data starts at array start
  );

  gl.bindBuffer(gl.ARRAY_BUFFER, this.radiusBuffer);
  gl.enableVertexAttribArray(2);
  gl.vertexAttribPointer(2,
    1, gl.FLOAT, //< one piece of float
    false, //< do not normalize (make unit length)
    0, //< tightly packed
    0 //< data starts at array start
  );

  gl.drawArrays(gl.TRIANGLES, 0, 3);
};
