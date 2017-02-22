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
  var triangleVertices = [
    {x: 400, y: 300},
    {x: 800, y: 300},
    {x: 600, y: 500},
  ];

  this.quadGeometry = new QuadGeometry(gl, triangleVertices);

  this.positionUniform = this.program.getUniform("trianglePosition", "vec3");
  this.rotationUniform = this.program.getUniform("triangleRotation", "vec2");
  this.triResolutionUniform = this.program.getUniform("u_resolution", "vec2");

  this.circleVertexShader = new Shader(gl, gl.VERTEX_SHADER, "circle_vs.essl");
  this.circleFragmentShader = new Shader(gl, gl.FRAGMENT_SHADER, "circle_fs.essl");

  var circleAttribs = ['a_position', 'a_center', 'a_radius'];
  this.circleProgram = new Program(gl, this.circleVertexShader, this.circleFragmentShader, circleAttribs);

  this.resolutionUniform = this.circleProgram.getUniform("u_resolution", "vec2");

  this.circle = new Circle(gl, {x: 400.0, y: 200.0, r: 100.0});

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

  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.enable(gl.BLEND);
  gl.disable(gl.DEPTH_TEST);

  // set shader program to use
  this.program.use();

  this.positionUniform.update(this.trianglePosition.x,
      this.trianglePosition.y,
      this.trianglePosition.z);

  this.rotationUniform.update(Math.cos(this.triangleRotation),
      Math.sin(this.triangleRotation));

  this.triResolutionUniform.update(this.gl.canvas.width, this.gl.canvas.height);

  this.quadGeometry.draw();


  this.circleProgram.use();
  this.resolutionUniform.update(this.gl.canvas.width, this.gl.canvas.height);
  this.circle.draw();

  // dt
  var timeAtThisFrame = new Date().getTime();
  var dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
  this.timeAtLastFrame = timeAtThisFrame;
    
  // triangle translation
  if(this.isMoving) {
    this.trianglePosition.x += 50 * dt;
  }

  // triangle rotation
  if(this.isSpinning) {
    this.triangleRotation += 0.3 * dt;
  }
};
