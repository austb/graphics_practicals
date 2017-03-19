var AVERAGE_DIAMOND_CREATION_RATE = 2.500;

var Scene = function(gl, output) {
  this.gl = gl;

  this.timeAtLastFrame = new Date().getTime();
  this.diamondCreationCounter = AVERAGE_DIAMOND_CREATION_RATE;

  // Load shaders and construct the program
  var vertexShader = new Shader(gl, gl.VERTEX_SHADER, "dragon_vs.essl");
  var fragmentShader = new Shader(gl, gl.FRAGMENT_SHADER, "dragon_fs.essl");
  var program = new Program(gl, vertexShader, fragmentShader);

  // Create a material from the program and a texture
  var material = new Material(gl, program);
  material.colorTexture.set(
    new Texture2D(gl, 'img/lander.png'));

  // Construct the quad to draw the texture on
  var quadGeometry = new QuadGeometry(gl);

  // Create a mesh of the shape and material
  var mesh = new Mesh(quadGeometry, material);

  // Create an animatable subclass of GameObject2D
  this.lander = new AnimatedGameObject2D(mesh, {spriteDimensions: {x: 1, y: 1}});
  this.lander.keyActions = landerActions;
  this.lander.bounds = {
    radius: 0.9
  };

  material = new Material(gl, program);
  material.colorTexture.set(
    new Texture2D(gl, 'img/afterburner.png'));

  mesh = new Mesh(quadGeometry, material);

  this.afterburner = new AnimatedGameObject2D(mesh, {spriteDimensions: {x: 1, y: 1}});
  this.afterburner.physics.position.set(-0.15, -1.38, 0.0);
  this.afterburner.scale.set(0.8, 0.5, 0.5);
  this.afterburner.physics.orientation = -Math.PI / 2;
  this.afterburner.disableAllEnvironmentForces();
  this.afterburner.parent = this.lander;
  this.afterburner.keyActions = afterBurnerActions("W");

  this.afterburner2 = new AnimatedGameObject2D(mesh, {spriteDimensions: {x: 1, y: 1}});
  this.afterburner2.physics.position.set(1.0, 0.2, 0.0);
  this.afterburner2.scale.set(0.5, 0.5, 0.5);
  this.afterburner2.disableAllEnvironmentForces();
  this.afterburner2.parent = this.lander;
  this.afterburner2.keyActions = afterBurnerActions("A");

  this.afterburner3 = new AnimatedGameObject2D(mesh, {spriteDimensions: {x: 1, y: 1}});
  this.afterburner3.physics.position.set(-0.9, 0.2, 0.0);
  this.afterburner3.scale.set(-0.5, 0.5, 0.5);
  this.afterburner3.disableAllEnvironmentForces();
  this.afterburner3.parent = this.lander;
  this.afterburner3.keyActions = afterBurnerActions("D");



  material = new Material(gl, program);
  material.colorTexture.set(
    new Texture2D(gl, 'img/platform.png'));

  mesh = new Mesh(quadGeometry, material);

  this.platform = new AnimatedGameObject2D(mesh, {spriteDimensions: {x: 1, y: 1}});
  this.platform.physics.position.set(10,0,0);
  this.platform.disableAllEnvironmentForces();

  material = new Material(gl, program);
  material.colorTexture.set(
    new Texture2D(gl, 'img/platformend.png'));

  mesh = new Mesh(quadGeometry, material);

  this.platformEndLeft = new AnimatedGameObject2D(mesh, {spriteDimensions: {x: 1, y: 1}});
  this.platformEndLeft.physics.position.set(-2.0, 0, 0);
  this.platformEndLeft.parent = this.platform;
  this.platformEndLeft.disableAllEnvironmentForces();

  this.platformEndRight = new AnimatedGameObject2D(mesh, {spriteDimensions: {x: 1, y: 1}});
  this.platformEndRight.physics.position.set(2.0, 0, 0);
  this.platformEndRight.parent = this.platform;
  this.platformEndRight.scale.set(-1, 1, 1);
  this.platformEndRight.disableAllEnvironmentForces();



  material = new Material(gl, program);
  material.colorTexture.set(
    new Texture2D(gl, 'img/diamond.png'));

  mesh = new Mesh(quadGeometry, material);

  this.newDiamond = (function(scene, mesh) {
    return function() {
      var diamond = new AnimatedGameObject2D(mesh, {spriteDimensions: {x: 1, y: 1}});

      var landerX = scene.lander.position.x;
      var landerY = scene.lander.position.y;

      var x = landerX + (Math.random() * 50) - 25;
      var y = landerY + (Math.random() * 25) + 25;
      diamond.physics.position.set(x, y, 0);
      diamond.bounds = {
        radius: 0.8
      };
      collidesWithLanderFn(diamond, diamondsCollisionWithLanderAction);

      scene.gameObjects.push(diamond);
    };
  })(this, mesh);


  this.gameObjects = [];
  this.gameObjects.push(this.lander);
  this.gameObjects.push(this.afterburner);
  this.gameObjects.push(this.afterburner2);
  this.gameObjects.push(this.afterburner3);

  this.gameObjects.push(this.platform);
  this.gameObjects.push(this.platformEndLeft);
  this.gameObjects.push(this.platformEndRight);

  material = new Material(gl, program);
  material.colorTexture.set(
    new Texture2D(gl, 'img/plasma.png'));

  mesh = new Mesh(quadGeometry, material);

  this.newPlasma = newPlasmaExhaustFn(this, mesh);

  this.camera = new OrthoCamera();

  this.physicsWorld = new PhysicsWorld(this.gameObjects);
};

Scene.prototype.update = function(gl, keysPressed) {
  // set clear color (part of the OpenGL render state)
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
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
  this.diamondCreationCounter -= dt;

  if(this.diamondCreationCounter <= 0) {
    this.newDiamond(this);

    this.diamondCreationCounter = AVERAGE_DIAMOND_CREATION_RATE;
  }

  this.physicsWorld.update(dt);

  if(keysPressed.K) {
    AVERAGE_DIAMOND_CREATION_RATE = 0.4;
  }

  var obj, i;
  for(i = 0; i < this.gameObjects.length; i++) {
    obj = this.gameObjects[i];

    obj.move(dt);

    if(obj.keyActions) {
      obj.keyActions(obj, keysPressed, dt, this);
    }

    if(obj.collidesWithLander) {
      obj.collidesWithLander(this.lander);
    }
  }

  this.camera.position.set(this.lander.position.x, this.lander.position.y);
  this.camera.updateViewProjMatrix();

  for(i = 0; i < this.gameObjects.length; i++) {
    obj = this.gameObjects[i];

    if(obj.removeAtTime < timeAtThisFrame) {
      this.gameObjects.splice(i, 1);
      i--;
    } else if(obj.shouldDisplay()) {
      obj.updateModelTransformation();
      obj.setTextureMat4();
      obj.draw(this.camera);
    }
  }
};
