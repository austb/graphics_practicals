var AVERAGE_DIAMOND_CREATION_RATE = 2.500;
var AVERAGE_FIREBALL_CREATION_RATE = 4.0;

var Scene = function(gl, output) {
  this.gl = gl;

  this.diamondCreationCounter = AVERAGE_DIAMOND_CREATION_RATE;
  this.fireballCreationCounter = AVERAGE_FIREBALL_CREATION_RATE;

  this.orbitalTheta = 0;

  // Load shaders and construct the program
  var vertexShader = new Shader(gl, gl.VERTEX_SHADER, "solid_vs.essl");
  var fragmentShader = new Shader(gl, gl.FRAGMENT_SHADER, "solid_fs.essl");
  var envFragmentShader = new Shader(gl, gl.FRAGMENT_SHADER, "envmap_fs.essl");

  var envQuadVS = new Shader(gl, gl.VERTEX_SHADER, "envquad_vs.essl");
  var envQuadFS = new Shader(gl, gl.FRAGMENT_SHADER, "envquad_fs.essl");
  var envQuadProg = new Program(gl, envQuadVS, envQuadFS);

  var program = new Program(gl, vertexShader, fragmentShader);

  // Create a material from the program and a texture
  var material1 = new Material(gl, program);
  material1.colorTexture.set(
    new Texture2D(gl, 'js/models/heli/heli.png'));
  material1.uMaterialShinyColor.set(
    new Vec3(1, 1, 1));
  material1.uShinyFactor.set(
    new Vec1(30.0));
  // material1.probeTexture.set(
  //   new Texture2D(gl, 'img/pp.png'));

  var material2 = new Material(gl, program);
  material2.colorTexture.set(
    new Texture2D(gl, 'js/models/heli/heliait.png'));
  material2.uMaterialShinyColor.set(
    new Vec3(1, 1, 1));
  material2.uShinyFactor.set(
    new Vec1(30.0));
  // material2.probeTexture.set(
  //   new Texture2D(gl, 'img/pp.png'));

  var rotorMaterial = new Material(gl, program);
  rotorMaterial.colorTexture.set(
    new Texture2D(gl, 'js/models/heli/heliait.png'));
  rotorMaterial.uMaterialShinyColor.set(
    new Vec3(1, 1, 1));
  rotorMaterial.uShinyFactor.set(
    new Vec1(10.0));

  var groundFS = new Shader(gl, gl.FRAGMENT_SHADER, "procedural_fs.essl");
  var procdGroundProg = new Program(gl, vertexShader, groundFS);
  var groundMat = new Material(gl, procdGroundProg);
  groundMat.rotateMat.set(
    (new Mat4()).rotate(25, new Vec3(1, 0, 0)));
  groundMat.uMaterialShinyColor.set(
    new Vec3(3, 3, 3));
  groundMat.uShinyFactor.set(
    new Vec1(30));

  this.ground = new AnimatedGameObject2D(
    new MultiMesh(gl, 'js/models/ground.json', [groundMat]),
    {spriteDimensions: {x: 1, y: 1}});
  this.ground.scale = 10000;
  this.ground.disableAllEnvironmentForces();

  var envMat = new Material(gl, envQuadProg);
  envMat.probeTexture.set(
    new Texture2D(gl, 'img/pp.png'));

  this.environment = new AnimatedGameObject2D(
    new MultiMesh(gl, 'js/models/envquad.json', [envMat]),
    {spriteDimensions: {x: 1, y: 1}});
  this.environment.disableAllEnvironmentForces();

  // this.multimesh = new MultiMesh(gl, 'js/models/slowpoke/Slowpoke.json', [material1, material2]);
  this.multimesh = new MultiMesh(gl, 'js/models/heli/heli1.json', [material2]);
  this.gameObj = new AnimatedGameObject2D(this.multimesh, {spriteDimensions: {x: 1, y: 1}});
  this.gameObj.scale = 0.1;

  this.gameObj.keyActions = function(obj, keysPressed, dt, scene) {
    if(keysPressed.W) {
      obj.physics.applyCenterOfMassForce(new Vec3(0, 0, obj.physics.mass * 20));
    }
    if(keysPressed.S) {
      obj.physics.applyCenterOfMassForce(new Vec3(0, 0, obj.physics.mass * -20));
    }
    if(keysPressed.D) {
      obj.physics.applyCenterOfMassForce(new Vec3(obj.physics.mass * -20, 0, 0));
    }
    if(keysPressed.A) {
      obj.physics.applyCenterOfMassForce(new Vec3(obj.physics.mass * 20, 0, 0));
    }
    if(keysPressed.SPACE) {
      obj.physics.applyCenterOfMassForce(new Vec3(0, obj.physics.mass * 30, 0));
    }
  };

  this.topRotor = new AnimatedGameObject2D(
    new MultiMesh(gl, 'js/models/heli/mainrotor.json', [material1, material1]),
    {spriteDimensions: {x: 1, y: 1}});
  this.topRotor.parent = this.gameObj;
  this.topRotor.physics.position.set(0, 15, 8);
  this.topRotor.orientation.set(0, 1, 0);
  this.topRotor.disableAllEnvironmentForces();

  this.tailRotor = new AnimatedGameObject2D(
    new MultiMesh(gl, 'js/models/heli/tailrotor.json', [material1, material1]),
    {spriteDimensions: {x: 1, y: 1}});
  this.tailRotor.parent = this.gameObj;
  this.tailRotor.physics.position.set(1.5, 9.7, -33);
  this.tailRotor.orientation.set(1, 0, 0);
  this.tailRotor.disableAllEnvironmentForces();

  this.camera = new PerspectiveCamera();

  this.gameObjects = [];
  this.gameObjects.push(this.environment);
  this.gameObjects.push(this.ground);
  this.gameObjects.push(this.gameObj);
  this.gameObjects.push(this.topRotor);
  this.gameObjects.push(this.tailRotor);

  this.lightSources = new LightSource(2);
  this.lightSources.setAmbientLight(new Vec3(0.2, 0.2, 0.2));
  this.lightSources.setDirectionalLight(0, new Vec3(5, 5, 5), new Vec3(0.4, 0.4, 0.4));
  this.lightSources.setPointLight(1, (new Vec3(50, 50, 0)), (new Vec3(0.7, 0.7, 0.7)).mul(4000));

  this.physicsWorld = new PhysicsWorld(this);
  this.physicsWorld.initialize();
};

Scene.prototype.update = function(gl, keysPressed) {
  if(!this.timeAtLastFrame) {
    this.timeAtLastFrame = new Date().getTime();
  }

  // set clear color (part of the OpenGL render state)
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  // clear the screen
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.enable(gl.DEPTH_TEST);

  // dt
  var timeAtThisFrame = new Date().getTime();
  var dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
  this.timeAtLastFrame = timeAtThisFrame;

  this.physicsWorld.update(dt);

  var obj;
  for(i = 0; i < this.gameObjects.length; i++) {
    obj = this.gameObjects[i];

    obj.move(dt);

    if(obj.keyActions) {
      obj.keyActions(obj, keysPressed, dt, this);
    }

  }

  this.topRotor.orientation.addScaled(dt, new Vec3(0, 20, 0));
  this.tailRotor.orientation.addScaled(dt, new Vec3(20, 0, 0));

  // this.camera.lookAt(this.gameObj);
  this.camera.move(dt, keysPressed);

  this.drawObjects();
};


Scene.prototype.drawObjects = function(cam, lightSources) {
  if(!cam) {
    cam = this.camera;
  }

  if(!lightSources) {
    lightSources = this.lightSources;
  }

  cam.updateViewMatrix();
  cam.updateUniforms();

  lightSources.updateUniforms();

  for(i = 0; i < this.gameObjects.length; i++) {
    obj = this.gameObjects[i];

    obj.updateModelTransformation();
    obj.setTextureMat4();
    obj.draw(cam, lightSources);
  }
};
