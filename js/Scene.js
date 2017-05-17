var Scene = function(gl, output) {
  this.gl = gl;

  // Load shaders and construct the program
  var vertexShader = new Shader(gl, gl.VERTEX_SHADER, "ray_trace.vert");
  var fragmentShader = new Shader(gl, gl.FRAGMENT_SHADER, "ray_trace.frag");
  var program = new Program(gl, vertexShader, fragmentShader);

  var mat = new Material(gl, program);
  mat.environmentSphericalTexture.set(
    new Texture2D(gl, 'img/reflection.jpg'));

  var sphere = new ClippedQuadric(mat, 0).
    makeCylinder(1, 5, new Vec3(-5, -16, -5)).
    setDiffuseColor(0, 0, 1).
    commitUniforms();
  var sphere2 = new ClippedQuadric(mat, 1).
    makeSphere(8.66, new Vec3(5, 5, 5)).
    setDiffuseColorWithShininess(0, 0, 1, 15).
    commitUniforms();
  var oceanPlane = new ClippedQuadric(mat, 2).
    makeInfinitePlane().
    setSurfaceMirrorReflectance(1, 1, 1).
    commitUniforms();

  var environment = new GameObject2D(
    new MultiMesh(gl, 'js/models/envquad.json', [mat]));

  this.camera = new PerspectiveCamera();

  this.gameObjects = [];
  this.gameObjects.push(environment);

  this.lightSources = new LightSource(2);
  this.lightSources.setDirectionalLight(0, new Vec3(5, 5, 5), new Vec3(0.7, 0.7, 0.7));
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

    obj.draw(cam, lightSources);
  }
};
