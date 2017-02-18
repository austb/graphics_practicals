var Scene = function(gl, output) {

  this.isMoving = false;
  this.isSpinning = false;
  this.triangleRotation = 0;
  this.trianglePosition = {x:0, y:0, z:0};
  this.timeAtLastFrame = new Date().getTime();

  this.vertexShader = new Shader(gl, gl.VERTEX_SHADER, "idle_vs.essl");
  this.fragmentShader = new Shader(gl, gl.FRAGMENT_SHADER, "blue_fs.essl");

  // shader program
  this.program = new Program(gl, this.vertexShader, this.fragmentShader);

  // The shape
  this.quadGeometry = new QuadGeometry(gl);

  this.positionUniform = this.program.getUniform("trianglePosition", "vec3");
  this.rotationUniform = this.program.getUniform("triangleRotation", "vec2");

};

Scene.prototype.toggleTranslation = function() {
  this.isMoving = !this.isMoving;
};

Scene.prototype.toggleRotation = function() {
  this.isSpinning = !this.isSpinning;
};

Scene.prototype.resetScene = function() {
  this.trianglePosition = {x:0, y:0, z:0};
  this.triangleRotation = 0;
};

Scene.prototype.update = function(gl) {
  // set clear color (part of the OpenGL render state)
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  // clear the screen
  gl.clear(gl.COLOR_BUFFER_BIT);

  // set shader program to use
  this.program.use();

  this.positionUniform.update(this.trianglePosition.x,
      this.trianglePosition.y,
      this.trianglePosition.z);

  this.rotationUniform.update(Math.cos(this.triangleRotation),
      Math.sin(this.triangleRotation));

  this.quadGeometry.draw();

  // dt
  var timeAtThisFrame = new Date().getTime();
  var dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
  this.timeAtLastFrame = timeAtThisFrame;
    
  // triangle translation
  if(this.isMoving) {
    this.trianglePosition.x += 0.5 * dt;
  }

  // triangle rotation
  if(this.isSpinning) {
    this.triangleRotation += 0.3 * dt;
  }
};
