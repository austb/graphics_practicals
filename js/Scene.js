var Scene = function(gl, output) {

  this.isAnimating = false;
  this.triangleRotation = 0;
  this.trianglePosition = {x:0, y:0, z:0};
  this.timeAtLastFrame = new Date().getTime();

  this.vertexShader = new Shader(gl, gl.VERTEX_SHADER, "idle_vs.essl");
  this.fragmentShader = new Shader(gl, gl.FRAGMENT_SHADER, "blue_fs.essl");

  // shader program
  this.program = new Program(gl, this.vertexShader, this.fragmentShader);

  // The shape
  this.quadGeometry = new QuadGeometry(gl);
};

Scene.prototype.startAnimation = function() {
  this.isAnimating = true;
};

Scene.prototype.update = function(gl) {
  // set clear color (part of the OpenGL render state)
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  // clear the screen
  gl.clear(gl.COLOR_BUFFER_BIT);

  // set shader program to use
  this.program.commit();

  // Bind translation uniform
  var trianglePositionLocation =
       gl.getUniformLocation(this.program.glProgram, "trianglePosition");
  if(trianglePositionLocation < 0)
    console.log("Could not find uniform trianglePosition.");
  else
    gl.uniform3f(trianglePositionLocation,
        this.trianglePosition.x, this.trianglePosition.y,
        this.trianglePosition.z);

  this.quadGeometry.draw();

  // dt
  var timeAtThisFrame = new Date().getTime();
  var dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
  this.timeAtLastFrame = timeAtThisFrame;
    
  // triangle translation
  if(this.isAnimating) {
    this.trianglePosition.x += 0.5 * dt;
  }

  // triangle rotation
  // this.triangleRotation += 0.3 * dt;
};
