var Scene = function(gl, output) {

  this.triangleRotation = 0;
  this.trianglePosition = {x:0, y:0, z:0};
  this.timeAtLastFrame = new Date().getTime();

  this.vbuffer_pos = new Float32Array(
      [0.0, 1.0, 0.5,
       0.866, 0.5, 0.5,
       0.25, 0.5, 0.5,
       -0.866, -0.5, 0.5,
       -0.5, -0.5, 0.5,
       0.0, -1.0, 0.5,
    ]);

  this.vbuffer_color = new Float32Array(
      [1.0, 0.0, 0.0,
       0.0, 1.0, 0.0,
       0.0, 0.0, 1.0,
       1.0, 0.0, 0.0,
       0.0, 1.0, 0.0,
       0.0, 0.0, 1.0,
    ]);

  // vertex position buffer
  this.vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER,
    this.vbuffer_pos,
    gl.STATIC_DRAW);

  // vertex color buffer
  this.vertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER,
    this.vbuffer_color,
    gl.STATIC_DRAW);

  // index buffer
  this.indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array([
      0, 1, 2,
      3, 4, 5,
    ]),
    gl.STATIC_DRAW);

  // vertex shader
  this.vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(this.vertexShader, shaderSource['idle_vs.essl']);
  gl.compileShader(this.vertexShader);
  if (!gl.getShaderParameter(this.vertexShader, gl.COMPILE_STATUS))
    alert("Error in vertex shader:\n" + gl.getShaderInfoLog(this.vertexShader));

  // fragment shader
  this.fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(this.fragmentShader, shaderSource['blue_fs.essl']);
  gl.compileShader(this.fragmentShader);
  if (!gl.getShaderParameter(this.fragmentShader, gl.COMPILE_STATUS))
    alert("Error in fragment shader:\n" + gl.getShaderInfoLog(this.fragmentShader));

  // shader program
  this.program = gl.createProgram();
  gl.attachShader(this.program, this.vertexShader);
  gl.attachShader(this.program, this.fragmentShader);

  gl.bindAttribLocation(this.program, 0, "vertexPosition");
  gl.bindAttribLocation(this.program, 1, "vertexColor");

  gl.linkProgram(this.program);
  if (!gl.getProgramParameter(this.program, gl.LINK_STATUS))
    alert("Error when linking shaders:\n" + gl.getProgramInfoLog(this.program));
}

Scene.prototype.update = function(gl) {
  // set clear color (part of the OpenGL render state)
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  // clear the screen
  gl.clear(gl.COLOR_BUFFER_BIT);

  // set shader program to use
  gl.useProgram(this.program);

  // Bind translation uniform
  var trianglePositionLocation =
       gl.getUniformLocation(this.program, "trianglePosition");
  if(trianglePositionLocation < 0)
    console.log("Could not find uniform trianglePosition.");
  else
    gl.uniform3f(trianglePositionLocation,
        this.trianglePosition.x, this.trianglePosition.y,
        this.trianglePosition.z);

  // Bind rotation uniform
  var triangleRotationUniform =
       gl.getUniformLocation(this.program, "triangleRotation");
  if(triangleRotationUniform < 0)
    console.log("Could not find uniform triangleRotation.");
  else
    gl.uniform2f(triangleRotationUniform,
        Math.cos(this.triangleRotation), Math.sin(this.triangleRotation));

  // set vertex buffer to pipeline input
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0,
    3, gl.FLOAT, //< three pieces of float
    false, //< do not normalize (make unit length)
    0, //< tightly packed
    0 //< data starts at array start
  );

  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1,
    3, gl.FLOAT, //< three pieces of float
    false, //< do not normalize (make unit length)
    0, //< tightly packed
    0 //< data starts at array start
  );

  // set index buffer to pipeline input
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

  gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_SHORT, 0);

  gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_SHORT, 3 * 2);

  // dt
  var timeAtThisFrame = new Date().getTime();
  var dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
  this.timeAtLastFrame = timeAtThisFrame;
    
  // triangle translation
  this.trianglePosition.x += 0.5 * dt;

  // triangle rotation
  this.triangleRotation += 0.3 * dt;
}
