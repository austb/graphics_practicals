var ANIM_RATE=0.10;

var Scene = function(gl, output) {

  this.gl = gl;

  this.isMoving = false;
  this.isSpinning = false;
  this.triangleRotation = 0;
  this.trianglePosition = {x:0, y:0, z:0};
  this.timeSinceLastSpriteChange = 0;
  this.spriteOffset = {x: 0, y: 0, z: 0};
  this.timeAtLastFrame = new Date().getTime();

  this.vertexShader = new Shader(gl, gl.VERTEX_SHADER, "dragon_vs.essl");
  this.fragmentShader = new Shader(gl, gl.FRAGMENT_SHADER, "dragon_fs.essl");

  // shader program
  var triangleAttribs = ['vertexPosition', 'vertexNormal', 'vertexTexCoord'];
  this.program = new Program(gl, this.vertexShader, this.fragmentShader, triangleAttribs);

  this.material = new Material(gl, this.program);
  this.material.colorTexture.set(
    new Texture2D(gl, 'img/dragon_red.png'));
  this.material.texOffset.set(0.0, 0.0);

  var triangleVertices = new Vec3Array(4);
  triangleVertices[0].set(new Vec3(1, 1, 0.0));
  triangleVertices[1].set(new Vec3(1, -1, 0.0));
  triangleVertices[2].set(new Vec3(-1, 1, 0.0));
  triangleVertices[3].set(new Vec3(-1, -1, 0.0));

  // The shape
  this.quadGeometry = new QuadGeometry(gl, triangleVertices);

  this.mesh = new Mesh(this.quadGeometry, this.material);
  this.dragon = new GameObject2D(this.mesh);
  this.gameObjects = [];
  this.gameObjects.push(this.dragon);
  this.camera = new OrthoCamera();
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

  gl.enable(gl.BLEND);
  gl.blendFunc(
    gl.SRC_ALPHA,
    gl.ONE_MINUS_SRC_ALPHA);

  // set shader program to use
  this.program.commit();

  var scale = {x: 8, y: 1, z: 1};
  var samplerMat = new Mat4().scale(scale).translate(this.spriteOffset);
  samplerMat.invert();
  this.material.texOffset.set(samplerMat);

  this.dragon.scale = {x:-0.25, y:0.25, z:0.25};
  this.dragon.position = new Vec3(this.trianglePosition);
  this.dragon.orientation = this.triangleRotation;
  this.dragon.updateModelTransformation();

  this.dragon.draw(this.camera);

  // dt
  var timeAtThisFrame = new Date().getTime();
  var dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
  this.timeAtLastFrame = timeAtThisFrame;

  this.timeSinceLastSpriteChange += dt;

  if(this.timeSinceLastSpriteChange >= ANIM_RATE) {
    this.spriteOffset.x += 1;
    this.spriteOffset.x %= 8;
    this.timeSinceLastSpriteChange = 0;
  }

  // triangle translation
  if(this.isMoving) {
    this.trianglePosition.x += 0.3 * dt;
  }

  // triangle rotation
  if(this.isSpinning) {
    this.triangleRotation += 0.3 * dt;
  }
};
