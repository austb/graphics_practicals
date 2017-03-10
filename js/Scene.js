var ANIM_RATE=0.10;

var setDragonTextureMat = function(offset) {
  var scale = {x: 8, y: 1, z: 1};
  var samplerMat = new Mat4().scale(scale).translate(offset);
  samplerMat.invert();
  Material.shared.textureProjMatrix.set(samplerMat);
};

var Scene = function(gl, output) {
  this.gl = gl;

  this.isMoving = false;
  this.isSpinning = false;
  this.timeSinceLastSpriteChange = 0;
  this.spriteOffset = {x: 0, y: 0, z: 0};
  this.timeAtLastFrame = new Date().getTime();

  var vertexShader = new Shader(gl, gl.VERTEX_SHADER, "dragon_vs.essl");
  var fragmentShader = new Shader(gl, gl.FRAGMENT_SHADER, "dragon_fs.essl");

  // shader program
  var triangleAttribs = ['vertexPosition', 'vertexNormal', 'vertexTexCoord'];
  var program = new Program(gl, vertexShader, fragmentShader, triangleAttribs);

  var material = new Material(gl, program);
  material.colorTexture.set(
    new Texture2D(gl, 'img/dragon_red.png'));

  var triangleVertices = new Vec3Array(4);
  triangleVertices[0].set(new Vec3(1, 1, 0.0));
  triangleVertices[1].set(new Vec3(1, -1, 0.0));
  triangleVertices[2].set(new Vec3(-1, 1, 0.0));
  triangleVertices[3].set(new Vec3(-1, -1, 0.0));

  // The shape
  var quadGeometry = new QuadGeometry(gl, triangleVertices);

  var mesh = new Mesh(quadGeometry, material);
  this.dragon = new GameObject2D(mesh);
  this.dragon.scale = {x:-0.25, y:0.25, z:0.25};
  setDragonTextureMat(this.spriteOffset);

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
  this.dragon.position = new Vec3(0, 0, 0);
  this.dragon.orientation = 0;
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

  this.timeSinceLastSpriteChange += dt;

  this.moveDragon(dt);

};

Scene.prototype.moveDragon = function(dt) {
  if(this.timeSinceLastSpriteChange >= ANIM_RATE) {
    this.spriteOffset.x += 1;
    this.spriteOffset.x %= 8;
    this.timeSinceLastSpriteChange = 0;

    setDragonTextureMat(this.spriteOffset);
  }

  // triangle translation
  if(this.isMoving) {
    this.dragon.position.add(0.5 * dt, 0, 0);
  }

  // triangle rotation
  if(this.isSpinning) {
    this.dragon.orientation += 1.0 * dt;
  }
};
