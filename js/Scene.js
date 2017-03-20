var AVERAGE_DIAMOND_CREATION_RATE = 2.500;
var AVERAGE_FIREBALL_CREATION_RATE = 1.0;

var Scene = function(gl, output) {
  this.gl = gl;

  this.diamondCreationCounter = AVERAGE_DIAMOND_CREATION_RATE;
  this.fireballCreationCounter = AVERAGE_FIREBALL_CREATION_RATE;

  // Load shaders and construct the program
  var vertexShader = new Shader(gl, gl.VERTEX_SHADER, "solid_vs.essl");
  var fragmentShader = new Shader(gl, gl.FRAGMENT_SHADER, "solid_fs.essl");
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
  this.lander.diamonds = 0;

  material = new Material(gl, program);
  material.colorTexture.set(
    new Texture2D(gl, 'img/boom.png'));

  mesh = new Mesh(quadGeometry, material);

  this.lander.boooooom = landerExplosion(this, this.lander, mesh);

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
  rectangleCollidesWithLanderFn(this.platform, platformCollisionWithLanderAction);

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

      // var landerX = scene.lander.position.x;
      // var landerY = scene.lander.position.y;
      var landerX = 0;
      var landerY = 0;

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

  material = new Material(gl, program);
  material.colorTexture.set(
    new Texture2D(gl, 'img/fireball.png'));

  mesh = new Mesh(quadGeometry, material);

  this.newFireball = (function(scene, mesh) {
    return function() {
      var fireball = new AnimatedGameObject2D(mesh, {spriteDimensions: {x: 1, y: 1}});
      fireball.disableAllEnvironmentForces();

      var landerX = scene.lander.position.x;
      var landerY = scene.lander.position.y;

      // Pick a location on the screen
      var shootAtX = landerX + (Math.random() * 10) - 5;
      var shootAtY = landerY + (Math.random() * 10) - 5;

      // Pick an angle between 0 and 120 degrees
      var shootAtAngle = -(Math.random() * (2/3) * Math.PI);
      var imageAngle = - 2 * Math.PI / 3;

      var worldAngle = imageAngle + shootAtAngle;

      // var position = new Vec3(shootAtX, shootAtY, 0);
      var position = new Vec3(shootAtX + -36 * Math.cos(worldAngle + Math.PI / 2), shootAtY + -36 * Math.sin(worldAngle + Math.PI / 2), 0);

      var velocity = new Vec3(10 * Math.cos(worldAngle + Math.PI / 2), 10 * Math.sin(worldAngle + (Math.PI / 2)), 0);


      fireball.physics.position.set(position);
      fireball.physics.velocity.set(velocity);
      fireball.physics.orientation= worldAngle + 3 * Math.PI / 4;
      fireball.scale.set(2.0, 2.0, 2.0);
      fireball.bounds = {
        radius: 1.5
      };
      fireball.physics.apply();
      collidesWithLanderFn(fireball, this.lander.boooooom);
      fireball.scheduleRemoval(60000);

      scene.gameObjects.push(fireball);
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

  this.physicsWorld = new PhysicsWorld(this);
  this.physicsWorld.initialize();
};

Scene.prototype.update = function(gl, keysPressed) {
  if(!this.timeAtLastFrame) {
    this.timeAtLastFrame = new Date().getTime();
  }
  // set clear color (part of the OpenGL render state)
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // clear the screen
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.enable(gl.BLEND);
  gl.blendFunc(
    gl.SRC_ALPHA,
    gl.ONE_MINUS_SRC_ALPHA);

  var diamondCounter = document.getElementById("diamond-counter");
  diamondCounter.textContent = this.lander.diamonds;

  // dt
  var timeAtThisFrame = new Date().getTime();
  var dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
  this.timeAtLastFrame = timeAtThisFrame;
  this.diamondCreationCounter -= dt;
  this.fireballCreationCounter -= dt;

  if(this.diamondCreationCounter <= 0) {
    this.newDiamond(this);

    this.diamondCreationCounter = AVERAGE_DIAMOND_CREATION_RATE;
  }

  if(this.fireballCreationCounter <= 0) {
    this.newFireball(this);

    this.fireballCreationCounter = AVERAGE_FIREBALL_CREATION_RATE;
  }

  this.physicsWorld.update(dt);

  if(keysPressed.K) {
    AVERAGE_DIAMOND_CREATION_RATE = 1.0;
  }

  var obj, i;
  for(i = 0; i < this.gameObjects.length; i++) {
    obj = this.gameObjects[i];

    obj.move(dt);

    if(obj.keyActions) {
      obj.keyActions(obj, keysPressed, dt, this);
    }

  }

  this.camera.position.set(this.lander.position.x, this.lander.position.y);
  this.camera.updateViewProjMatrix();

  for(i = 0; i < this.gameObjects.length; i++) {
    obj = this.gameObjects[i];

    if(obj.removeAtTime < timeAtThisFrame || (obj.parent && obj.parent.removeAtTime < timeAtThisFrame)) {
      this.gameObjects.splice(i, 1);
      i--;
    } else if(obj.shouldDisplay()) {
      obj.updateModelTransformation();
      obj.setTextureMat4();
      obj.draw(this.camera);
    }
  }
};
