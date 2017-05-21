var Scene = function(gl, output) {
  this.gl = gl;

  // Load shaders and construct the program
  var vertexShader = new Shader(gl, gl.VERTEX_SHADER, "ray_trace.vert");
  var fragmentShader = new Shader(gl, gl.FRAGMENT_SHADER, "ray_trace.frag");
  var program = new Program(gl, vertexShader, fragmentShader);

  var mat = new Material(gl, program);
  mat.environmentSphericalTexture.set(
    new Texture2D(gl, 'img/reflection.jpg'));
  mat.sandTexture.set(
    new Texture2D(gl, 'img/sand.jpg'));
  mat.woodTexture.set(
    new Texture2D(gl, 'img/wood.jpg'));

  var oceanPlane = new ClippedQuadric(mat.quadrics, mat.brdfs, 0).
    makeInfinitePlane().
    setSurfaceMirrorReflectance(0.5, 0.5, 0.5).
    commitUniforms();
  var sandDune = new ClippedQuadric(mat.quadrics, mat.brdfs,  1).
    makeEllipsoid(30, 4, 20, new Vec3(0, 0, 0)).
    setColorTexture(1).
    commitUniforms();
  var parasolPole = new ClippedQuadric(mat.quadrics, mat.brdfs, 2).
    makeCylinder(0.2, 4, new Vec3(13, 4, 15)).
    setDiffuseColorWithShininess(0.8, 0.8, 0.8, 10).
    setRotationTogether(-Math.PI / 12).
    commitUniforms();
  var parasolTop= new ClippedQuadric(mat.quadrics, mat.brdfs, 3).
    makeSphere(6, new Vec3(12.8, 2, 14.5)).
    clipWithSlab(5).
    setRotationTogether(-Math.PI / 16).
    setDiffuseColor(0, 1, 1).
    commitUniforms();
  var castleTower1 = new ClippedQuadric(mat.quadrics, mat.brdfs, 4).
    makeCylinder(1, 4, new Vec3(-10, 4, 5)).
    setColorTexture(1).
    setColorTextureOrientation(3).
    commitUniforms();
  var castleTower2 = new ClippedQuadric(mat.quadrics, mat.brdfs, 5).
    makeCylinder(1, 4, new Vec3(-10, 4, -5)).
    setColorTexture(1).
    setColorTextureOrientation(3).
    commitUniforms();
  var castleTower3 = new ClippedQuadric(mat.quadrics, mat.brdfs, 6).
    makeCylinder(1, 4, new Vec3(-20, 4, -5)).
    setColorTexture(1).
    setColorTextureOrientation(3).
    commitUniforms();
  var castleTower4 = new ClippedQuadric(mat.quadrics, mat.brdfs, 7).
    makeCylinder(1, 4, new Vec3(-20, 4, 5)).
    setColorTexture(1).
    setColorTextureOrientation(3).
    commitUniforms();

  var castleTowerTop1 = new ClippedQuadric(mat.quadrics, mat.brdfs, 8).
    makeCone(2, 1, new Vec3(-10, 10, 5)).
    setColorTexture(1).
    commitUniforms();
  var castleTowerTop2 = new ClippedQuadric(mat.quadrics, mat.brdfs, 9).
    makeCone(2, 1, new Vec3(-10, 10, -5)).
    setColorTexture(1).
    commitUniforms();
  var castleTowerTop3 = new ClippedQuadric(mat.quadrics, mat.brdfs, 10).
    makeCone(2, 1, new Vec3(-20, 10, -5)).
    setColorTexture(1).
    commitUniforms();
  var castleTowerTop4 = new ClippedQuadric(mat.quadrics, mat.brdfs, 11).
    makeCone(2, 1, new Vec3(-20, 10, 5)).
    setColorTexture(1).
    commitUniforms();
  this.beachBallPosition = new Vec3(0, 5, 0);
  this.beachBall = new ClippedQuadric(mat.quadrics, mat.brdfs, 12).
    makeSphere(1, this.beachBallPosition).
    setDiffuseColorWithShininess(501, 0, 0, 25). // Beach ball texturing
    commitUniforms();
  var trunk1 = new ClippedQuadric(mat.quadrics, mat.brdfs, 13).
    makeCone(12, 2, new Vec3(15, 12, 0)).
    setPositionClipper(new Vec3(0, 3, 0)).
    setScaleClipper(3).
    setRotationTogether(-Math.PI / 16, new Vec3(1, 0, 0)).
    setDiffuseColor(160/255,82/255,45/255).
    commitUniforms();
  var trunk2 = new ClippedQuadric(mat.quadrics, mat.brdfs, 14).
    makeCone(8, 1.8, new Vec3(15, 12, 0.5)).
    setPositionClipper(new Vec3(0, 8, 0)).
    setScaleClipper(2).
    setRotationTogether(-Math.PI / 32, new Vec3(1, 0, 0)).
    setDiffuseColor(160/255,82/255,45/255).
    commitUniforms();
  var trunk3 = new ClippedQuadric(mat.quadrics, mat.brdfs, 15).
    makeCone(8, 1.6, new Vec3(15, 14, 0.6)).
    setPositionClipper(new Vec3(0, 11, 0)).
    setScaleClipper(2).
    setRotationTogether(-Math.PI / 48, new Vec3(1, 0, 0)).
    setDiffuseColor(160/255,82/255,45/255).
    commitUniforms();
  var trunk4 = new ClippedQuadric(mat.quadrics, mat.brdfs, 16).
    makeCone(3, 0.65, new Vec3(15, 15, 0.8)).
    setDiffuseColor(160/255,82/255,45/255);
  trunk4.clipperTranslation.position.y -= 0.5;
  trunk4.commitUniforms();

  var leaf1 = new ClippedQuadric(mat.quadrics, mat.brdfs, 17).
    makeSphere(1, new Vec3(17, 14.5, 0.8)).
    setDiffuseColor(30 / 255, 147 / 255, 45 / 255).
    setScaleSurface(new Vec3(2, 0.1, 1)).
    clipWithSlab(0.1);
  leaf1.clipperTranslation.position.y -= 0.1;
  leaf1.commitUniforms();
  var leaf2 = new ClippedQuadric(mat.quadrics, mat.brdfs, 18).
    makeSphere(1, new Vec3(13, 14.5, 0.8)).
    setDiffuseColor(30 / 255, 147 / 255, 45 / 255).
    setScaleSurface(new Vec3(2, 0.1, 1)).
    clipWithSlab(0.1);
  leaf2.clipperTranslation.position.y -= 0.1;
  leaf2.commitUniforms();
  var leaf3 = new ClippedQuadric(mat.quadrics, mat.brdfs, 19).
    makeSphere(1, new Vec3(15, 14.5, 2.8)).
    setDiffuseColor(30 / 255, 147 / 255, 45 / 255).
    setScaleSurface(new Vec3(1, 0.1, 2)).
    clipWithSlab(0.1);
  leaf3.clipperTranslation.position.y -= 0.1;
  leaf3.commitUniforms();
  var leaf4 = new ClippedQuadric(mat.quadrics, mat.brdfs, 20).
    makeSphere(1, new Vec3(15, 14.5, -1.2)).
    setDiffuseColor(30 / 255, 147 / 255, 45 / 255).
    setScaleSurface(new Vec3(1, 0.1, 2)).
    clipWithSlab(0.1);
  leaf4.clipperTranslation.position.y -= 0.1;
  leaf4.commitUniforms();

  this.boxSide = new ClippedQuadric(mat.double_quadrics, mat.double_brdfs, 0, true).
    makeRectangle(new Vec3(15, 1.5, 30)).
    setRotationTogether(-Math.PI / 12).
    setColorTexture(2).
    commitUniforms();
  this.boxSide2 = new ClippedQuadric(mat.double_quadrics, mat.double_brdfs, 1, true);
  this.boxSide3 = new ClippedQuadric(mat.double_quadrics, mat.double_brdfs, 2, true);
  this.boxSide.completeSolid(this.boxSide2, this.boxSide3);

  var sandCastleBase1 = new ClippedQuadric(mat.double_quadrics, mat.double_brdfs, 3, true).
    makeRectangle(new Vec3(-15, 1.5, 0)).
    setScaleTogether(5, 2, 5).
    setColorTexture(1).
    commitUniforms();
  var sandCastleBase2 = new ClippedQuadric(mat.double_quadrics, mat.double_brdfs, 4, true);
  var sandCastleBase3 = new ClippedQuadric(mat.double_quadrics, mat.double_brdfs, 5, true);
  sandCastleBase1.completeSolid(sandCastleBase2, sandCastleBase3);

  var environment = new GameObject2D(
    new MultiMesh(gl, 'js/models/envquad.json', [mat]));

  this.camera = new PerspectiveCamera();

  this.gameObjects = [];
  this.gameObjects.push(environment);

  this.lightSources = new LightSource(2);
  this.lightSources.setDirectionalLight(0, new Vec3(5, 5, 5), new Vec3(0.9, 0.9, 0.9));
};

Scene.prototype.update = function(gl, keysPressed) {
  if(!this.timeAtLastFrame) {
    this.timeAtLastFrame = new Date().getTime();
    this.totalTime = 0;
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
  this.totalTime += dt;

  var perturbation = Math.sin(4 * this.totalTime);
  this.beachBall.setPositionTogether(this.beachBallPosition.plus(0, 1 + perturbation, 0)).
    commitUniforms();

  perturbation = 0.1 * Math.sin(this.totalTime);
  this.boxSide.
    setRotationTogether(-Math.PI / 12 + perturbation);
  this.boxSide.completeSolid(this.boxSide2, this.boxSide3);

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
