var Scene = function(gl, output) {

  this.gl = gl;

  this.isMoving = false;
  this.isSpinning = false;
  this.triangleRotation = 0;
  this.trianglePosition = {x:0, y:0, z:0};
  this.timeAtLastFrame = new Date().getTime();

  this.vertexShader = new Shader(gl, gl.VERTEX_SHADER, "idle_vs.essl");
  this.fragmentShader = new Shader(gl, gl.FRAGMENT_SHADER, "blue_fs.essl");

  // shader program
  var triangleAttribs = ['vertexPosition', 'vertexNormal', 'vertexTexCoord'];
  this.program = new Program(gl, this.vertexShader, this.fragmentShader, triangleAttribs);
  // The shape

  var triangleVertices = new Vec3Array(4);
  triangleVertices[0].set(new Vec3(1, 1, 0.0));
  triangleVertices[1].set(new Vec3(1, -1, 0.0));
  triangleVertices[2].set(new Vec3(-1, 1, 0.0));
  triangleVertices[3].set(new Vec3(-1, -1, 0.0));

  this.quadGeometry = new QuadGeometry(gl, triangleVertices);

  this.modelMatrixUniformLocation = gl.getUniformLocation(
    this.program.glProgram, "modelMatrix");

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

  var modelMatrix;
  if(this.modelMatrixUniformLocation === null) {
    console.log("Could not find uniform modelMatrix.");
  } else {
    modelMatrix = new Mat4().rotate(this.triangleRotation).translate(this.trianglePosition).scale(0.25);
    modelMatrix.commit(gl, this.modelMatrixUniformLocation);
  }

  this.quadGeometry.draw();

  if(this.modelMatrixUniformLocation === null) {
    console.log("Could not find uniform modelMatrix.");
  } else {
    modelMatrix = new Mat4().rotate(-1 * this.triangleRotation).translate(-1 * this.trianglePosition.x).scale(0.25);
    modelMatrix.commit(gl, this.modelMatrixUniformLocation);
  }

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
