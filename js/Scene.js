var AVERAGE_DIAMOND_CREATION_RATE = 2.500;
var AVERAGE_FIREBALL_CREATION_RATE = 4.0;

var Scene = function(gl, output) {
  this.gl = gl;

  this.diamondCreationCounter = AVERAGE_DIAMOND_CREATION_RATE;
  this.fireballCreationCounter = AVERAGE_FIREBALL_CREATION_RATE;

  // Load shaders and construct the program
  var vertexShader = new Shader(gl, gl.VERTEX_SHADER, "solid_vs.essl");
  var fragmentShader = new Shader(gl, gl.FRAGMENT_SHADER, "solid_fs.essl");
  var program = new Program(gl, vertexShader, fragmentShader);

  // Create a material from the program and a texture
  var material1 = new Material(gl, program);
  material1.colorTexture.set(
    new Texture2D(gl, 'js/models/slowpoke/YadonDh.png'));

  var material2 = new Material(gl, program);
  material2.colorTexture.set(
    new Texture2D(gl, 'js/models/slowpoke/YadonEyeDh.png'));

  this.multimesh = new MultiMesh(gl, 'js/models/slowpoke/Slowpoke.json', [material1, material2]);
  this.gameObj = new AnimatedGameObject2D(this.multimesh, {spriteDimensions: {x: 1, y: 1}});

  this.camera = new PerspectiveCamera();

  this.gameObjects = [];
  this.gameObjects.push(this.gameObj);
};

Scene.prototype.update = function(gl, keysPressed) {
  if(!this.timeAtLastFrame) {
    this.timeAtLastFrame = new Date().getTime();
  }

  // set clear color (part of the OpenGL render state)
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  // clear the screen
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.enable(gl.BLEND);
  gl.blendFunc(
    gl.SRC_ALPHA,
    gl.ONE_MINUS_SRC_ALPHA);
  gl.enable(gl.DEPTH_TEST);

  // dt
  var timeAtThisFrame = new Date().getTime();
  var dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
  this.timeAtLastFrame = timeAtThisFrame;

  // var obj, i;
  // for(i = 0; i < this.gameObjects.length; i++) {
  //   obj = this.gameObjects[i];

  //   // obj.move(dt);

  //   if(obj.keyActions) {
  //     obj.keyActions(obj, keysPressed, dt, this);
  //   }

  // }

  this.camera.move(dt, keysPressed);

  this.camera.updateViewMatrix();
  this.gameObj.updateModelTransformation();
  this.gameObj.draw(this.camera);

  // this.drawObjects();
};


Scene.prototype.drawObjects = function(cam) {
  if(!cam) {
    cam = this.camera;
  }

  cam.updateViewProjMatrix();
  for(i = 0; i < this.gameObjects.length; i++) {
    obj = this.gameObjects[i];

    obj.updateModelTransformation();
    // obj.setTextureMat4();
    obj.draw(cam);
  }
};
