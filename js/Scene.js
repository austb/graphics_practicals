var Scene = function(gl, output) {
  this.gl = gl;

  this.timeAtLastFrame = new Date().getTime();

  // Load shaders and construct the program
  var vertexShader = new Shader(gl, gl.VERTEX_SHADER, "dragon_vs.essl");
  var fragmentShader = new Shader(gl, gl.FRAGMENT_SHADER, "dragon_fs.essl");
  var program = new Program(gl, vertexShader, fragmentShader);

  // Create a material from the program and a texture
  var material = new Material(gl, program);
  material.colorTexture.set(
    new Texture2D(gl, 'img/dragon_red.png'));

  // Construct the quad to draw the texture on
  var quadGeometry = new QuadGeometry(gl);

  // Create a mesh of the shape and material
  var mesh = new Mesh(quadGeometry, material);

  // Create an animatable subclass of GameObject2D
  this.dragon = new AnimatedGameObject2D(mesh, {spriteDimensions: {x: 8, y: 1}});

  this.gameObjects = [];
  this.gameObjects.push(this.dragon);
  this.camera = new OrthoCamera();
};

Scene.prototype.toggleTranslation = function() {
  this.dragon.toggleMovement();
};

Scene.prototype.toggleRotation = function() {
  this.dragon.toggleRotation();
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

  // dt
  var timeAtThisFrame = new Date().getTime();
  var dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
  this.timeAtLastFrame = timeAtThisFrame;

  for(var i = 0; i < this.gameObjects.length; i++) {
    var obj = this.gameObjects[i];
    obj.move(dt);
    obj.updateModelTransformation();
    obj.draw(this.camera);
  }

};
