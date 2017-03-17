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
    new Texture2D(gl, 'img/lander.png'));

  // Construct the quad to draw the texture on
  var quadGeometry = new QuadGeometry(gl);

  // Create a mesh of the shape and material
  var mesh = new Mesh(quadGeometry, material);

  // Create an animatable subclass of GameObject2D
  this.lander = new AnimatedGameObject2D(mesh, {spriteDimensions: {x: 1, y: 1}});
  this.lander.keyActions = landerActions;




  material = new Material(gl, program);
  material.colorTexture.set(
    new Texture2D(gl, 'img/afterburner.png'));

  mesh = new Mesh(quadGeometry, material);

  this.afterburner = new AnimatedGameObject2D(mesh, {spriteDimensions: {x: 1, y: 1}});
  this.afterburner.physics.position.set(0.15, -1.4, 0.0);
  this.afterburner.scale.set(0.8, 0.5, 0.5);
  this.afterburner.physics.orientation = Math.PI / 2;
  this.afterburner.disableAllEnvironmentForces();
  this.afterburner.parent = this.lander;
  this.afterburner.keyActions = afterBurnerActions("W");

  this.afterburner2 = new AnimatedGameObject2D(mesh, {spriteDimensions: {x: 1, y: 1}});
  this.afterburner2.physics.position.set(0.9, 0.2, 0.0);
  this.afterburner2.scale.set(-0.5, 0.5, 0.5);
  this.afterburner2.disableAllEnvironmentForces();
  this.afterburner2.parent = this.lander;
  this.afterburner2.keyActions = afterBurnerActions("A");

  this.afterburner3 = new AnimatedGameObject2D(mesh, {spriteDimensions: {x: 1, y: 1}});
  this.afterburner3.physics.position.set(-1.0, 0.2, 0.0);
  this.afterburner3.scale.set(0.5, 0.5, 0.5);
  this.afterburner3.disableAllEnvironmentForces();
  this.afterburner3.parent = this.lander;
  this.afterburner3.keyActions = afterBurnerActions("D");

  this.gameObjects = [];
  this.gameObjects.push(this.lander);
  this.gameObjects.push(this.afterburner);
  this.gameObjects.push(this.afterburner2);
  this.gameObjects.push(this.afterburner3);




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

  this.physicsWorld.update(dt);

  var obj, i;
  for(i = 0; i < this.gameObjects.length; i++) {
    obj = this.gameObjects[i];

    obj.move(dt);
    if(obj.keyActions) {
      obj.keyActions(obj, keysPressed);
    }
  }

  for(i = 0; i < this.gameObjects.length; i++) {
    obj = this.gameObjects[i];

    if(obj.shouldDisplayObject()) {
      obj.updateModelTransformation();
      obj.draw(this.camera);
    }
  }

};
