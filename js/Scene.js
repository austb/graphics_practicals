var Scene = function(gl, output) {
  this.gl = gl;

  this.timeAtLastFrame = new Date().getTime();

  var vertexShader = new Shader(gl, gl.VERTEX_SHADER, "dragon_vs.essl");
  var fragmentShader = new Shader(gl, gl.FRAGMENT_SHADER, "dragon_fs.essl");

  // shader program
  var triangleAttribs = ['vertexPosition', 'vertexNormal', 'vertexTexCoord'];
  var program = new Program(gl, vertexShader, fragmentShader, triangleAttribs);

  var material = new Material(gl, program);
  material.colorTexture.set(
    new Texture2D(gl, 'img/dragon_red.png'));

  // The shape
  var quadGeometry = new QuadGeometry(gl);

  var mesh = new Mesh(quadGeometry, material);
  this.dragon = new Dragon(mesh);

  this.gameObjects = [];
  this.gameObjects.push(this.dragon);

  this.camera = new OrthoCamera();
};

Scene.prototype.toggleTranslation = function() {
  this.dragon.isMoving = !this.dragon.isMoving;
};

Scene.prototype.toggleRotation = function() {
  this.dragon.isSpinning = !this.dragon.isSpinning;
};

Scene.prototype.resetScene = function() {
  this.dragon.resetPosition();
};

Scene.prototype.update = function(gl) {
  // set clear color (part of the OpenGL render state)
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  // clear the screen
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.enable(gl.BLEND);
  gl.blendFunc(
    gl.SRC_ALPHA,
    gl.ONE_MINUS_SRC_ALPHA);

  this.dragon.updateModelTransformation();
  this.dragon.draw(this.camera);

  // dt
  var timeAtThisFrame = new Date().getTime();
  var dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
  this.timeAtLastFrame = timeAtThisFrame;

  this.dragon.move(dt);
};
