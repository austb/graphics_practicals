var ClippedQuadric = function(uniformArray, brdfArray, quadricNumber, isDoubleClipped) {
  this.uniformArray = uniformArray;
  this.brdfArray = brdfArray;
  this.quadricNumber = quadricNumber;
  this.surfaceCoeffMatrix = new Mat4();
  this.clipperCoeffMatrix = new Mat4();
  this.additionalClipperCoeffMatrix = new Mat4();

  this.surfaceTranslation = {};
  this.surfaceTranslation.scale = new Vec3(1, 1, 1);
  this.surfaceTranslation.rotation = 0;
  this.surfaceTranslation.rotationAxis = new Vec3(0, 0, 1);
  this.surfaceTranslation.position = new Vec3();

  this.clipperTranslation = {};
  this.clipperTranslation.scale = new Vec3(1, 1, 1);
  this.clipperTranslation.rotation = 0;
  this.clipperTranslation.rotationAxis = new Vec3(0, 0, 1);
  this.clipperTranslation.position = new Vec3(0, 0, 0);

  this.additionalClipperTranslation = {};
  this.additionalClipperTranslation.scale = new Vec3(1, 1, 1);
  this.additionalClipperTranslation.rotation = 0;
  this.additionalClipperTranslation.rotationAxis = new Vec3(0, 0, 1);
  this.additionalClipperTranslation.position = new Vec3(0, 0, 0);

  this.brdf = new Vec4();

  if(isDoubleClipped) {
    this.isDoubleClipped = true;
  } else {
    this.isDoubleClipped = false;
  }
};

ClippedQuadric.prototype.setDiffuseColor = function(r, g, b) {
  return this.setDiffuseColorWithShininess(r, g, b, 0);
};

ClippedQuadric.prototype.setDiffuseColorWithShininess = function(r, g, b, s) {
  this.brdf.set(r, g, b, s);

  return this;
};

ClippedQuadric.prototype.setSurfaceMirrorReflectance = function(r, g, b) {
  this.brdf.set(r, g, b, 220);

  return this;
};

ClippedQuadric.prototype.setColorTexture = function(texture) {
  this.brdf.set(texture, 1, 0, 301);

  return this;
};

ClippedQuadric.prototype.setColorTextureOrientation = function(orientation) {
  this.brdf.y = orientation;

  return this;
};

ClippedQuadric.prototype.commitUniforms = function() {
  if(this.isDoubleClipped) {
    this.commitDoubleClippedUniforms();
  } else {
    this.commitSingleClippedUniforms();
  }

  return this;
};

ClippedQuadric.prototype.commitSingleClippedUniforms = function() {
  var trans = new Mat4().
    scale(this.surfaceTranslation.scale).
    rotate(this.surfaceTranslation.rotation, this.surfaceTranslation.rotationAxis).
    translate(this.surfaceTranslation.position).invert();
  this.uniformArray[2 * this.quadricNumber].set(this.surfaceCoeffMatrix).
      premul(trans).
      mul(new Mat4(trans).transpose());

  trans = new Mat4().
    scale(this.clipperTranslation.scale).
    rotate(this.clipperTranslation.rotation, this.clipperTranslation.rotationAxis).
    translate(this.clipperTranslation.position).invert();
  this.uniformArray[2 * this.quadricNumber + 1].set(this.clipperCoeffMatrix).
      premul(trans).
      mul(new Mat4(trans).transpose());

  this.brdfArray[this.quadricNumber].set(this.brdf);
};

ClippedQuadric.prototype.commitDoubleClippedUniforms = function() {
  var trans = new Mat4().
    scale(this.surfaceTranslation.scale).
    rotate(this.surfaceTranslation.rotation, this.surfaceTranslation.rotationAxis).
    translate(this.surfaceTranslation.position).invert();
  this.uniformArray[3 * this.quadricNumber].set(this.surfaceCoeffMatrix).
      premul(trans).
      mul(new Mat4(trans).transpose());

  trans = new Mat4().
    scale(this.clipperTranslation.scale).
    rotate(this.clipperTranslation.rotation, this.clipperTranslation.rotationAxis).
    translate(this.clipperTranslation.position).invert();
  this.uniformArray[3 * this.quadricNumber + 1].set(this.clipperCoeffMatrix).
      premul(trans).
      mul(new Mat4(trans).transpose());

  trans = new Mat4().
    scale(this.additionalClipperTranslation.scale).
    rotate(this.additionalClipperTranslation.rotation, this.additionalClipperTranslation.rotationAxis).
    translate(this.additionalClipperTranslation.position).invert();
  this.uniformArray[3 * this.quadricNumber + 2].set(this.additionalClipperCoeffMatrix).
      premul(trans).
      mul(new Mat4(trans).transpose());

  this.brdfArray[this.quadricNumber].set(this.brdf);
};

ClippedQuadric.prototype.makeCone = function(height, width, pos) {
  var clipperPos = new Vec3().set(pos);
  clipperPos.y -= height / 2;

  this.setUnitCone().
    setScaleSurface(new Vec3(width, height, width)).
    setScaleClipper(new Vec3(width, height / 2, width)).
    setPositionSurface(pos).
    setPositionClipper(clipperPos);

  return this;
};

ClippedQuadric.prototype.setUnitCone = function() {
  this.surfaceCoeffMatrix.set(
    1, 0, 0, 0,
    0, -1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 0);
  this.clipperCoeffMatrix.set(
    0,  0, 0, 0,
    0, -1, 0, 0,
    0,  0, 0, 0,
    0,  0, 0, 1);

  return this;
};

ClippedQuadric.prototype.makeEllipsoid = function(a, b, c, position) {
  return this.setUnitSphere().
              setScaleTogether(new Vec3(a, b, c)).
              setPositionTogether(position);
};

ClippedQuadric.prototype.makeSphere = function(radius, position) {
  return this.setUnitSphere().
              setScaleTogether(radius).
              setPositionTogether(position);
};

ClippedQuadric.prototype.setUnitSphere = function(){
  this.surfaceCoeffMatrix.set(
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, -1);
  this.clipperCoeffMatrix.set(
    0,  0, 0, 0,
    0, -1, 0, 0,
    0,  0, 0, 0,
    0,  0, 0, 1);

  return this;
};

ClippedQuadric.prototype.makeCylinder = function(width, height, pos) {
  return this.setUnitCylinder().
              setScaleTogether(new Vec3(width, height, width)).
              setPositionTogether(pos);
};

ClippedQuadric.prototype.setUnitCylinder = function() {
  this.surfaceCoeffMatrix.set(
    1, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, -1);
  this.clipperCoeffMatrix.set(
    0,  0, 0, 0,
    0,  -1, 0, 0,
    0,  0, 0, 0,
    0,  0, 0, 1);

  return this;
};

ClippedQuadric.prototype.makeInfinitePlane = function() {
  return this.setInfinitePlane();
};

ClippedQuadric.prototype.setInfinitePlane = function() {
  this.surfaceCoeffMatrix.set(
    0, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, -1);
  this.clipperCoeffMatrix.set(
    0,  0, 0, 0,
    0,  0, 0, 0,
    0,  0, 0, 0,
    0,  0, 0, 0);

  return this;
};

ClippedQuadric.prototype.makeRectangle = function(pos) {
  return this.setUnitSquare().
              setPositionTogether(pos);
};

ClippedQuadric.prototype.setUnitSquare = function() {
  if(!this.isDoubleClipped) console.warn("This is not a double clipped quad");

  this.surfaceCoeffMatrix.set(
    -1, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 1);
  this.clipperCoeffMatrix.set(
    0,  0, 0, 0,
    0,  -1, 0, 0,
    0,  0, 0, 0,
    0,  0, 0, 1);
  this.additionalClipperCoeffMatrix.set(
    0,  0, 0, 0,
    0,  0, 0, 0,
    0,  0, -1, 0,
    0,  0, 0, 1);

  return this;
};

ClippedQuadric.prototype.clipWithSlab = function(width) {
  return this.clipWithUnitSlab().
              setScaleClipper(width);
};

ClippedQuadric.prototype.clipWithUnitSlab = function() {
  this.clipperCoeffMatrix.set(
    0,  0, 0, 0,
    0,  1, 0, 0,
    0,  0, 0, 0,
    0,  0, 0, -1);

  return this;
};

ClippedQuadric.prototype.setScaleTogether = function(scale) {
  return this.setScaleSurface(scale).
              setScaleClipper(scale);
};

ClippedQuadric.prototype.setScaleSurface = function(scale) {
  if(scale.x) {
    this.surfaceTranslation.scale.set(scale);
  } else {
    this.surfaceTranslation.scale.set(scale, scale, scale);
  }

  return this;
};

ClippedQuadric.prototype.setScaleClipper = function(scale) {
  if(scale.x) {
    this.clipperTranslation.scale.set(scale);
  } else {
    this.clipperTranslation.scale.set(scale, scale, scale);
  }

  if(this.isDoubleClipped) {
    this.additionalClipperTranslation.scale.set(this.clipperTranslation.scale);
  }

  return this;
};

ClippedQuadric.prototype.setPositionTogether = function(pos) {
  return this.setPositionSurface(pos).
              setPositionClipper(pos);
};

ClippedQuadric.prototype.setPositionSurface = function(pos) {
  this.surfaceTranslation.position = pos;

  return this;
};

ClippedQuadric.prototype.setPositionClipper = function(pos) {
  this.clipperTranslation.position = pos;

  if(this.isDoubleClipped) this.additionalClipperTranslation.position = pos;

  return this;
};


ClippedQuadric.prototype.completeSolid = function(quad1, quad2) {
  if(this.isDoubleClipped) {
    this.completeDoubleClippedSolid(quad1, quad2);
  } else {
    this.completeSingleClippedSolid(quad1);
  }
};

ClippedQuadric.prototype.completeDoubleClippedSolid = function(quad1, quad2) {
  quad1.surfaceCoeffMatrix.set(this.clipperCoeffMatrix);
  quad1.clipperCoeffMatrix.set(this.additionalClipperCoeffMatrix);
  quad1.additionalClipperCoeffMatrix.set(this.surfaceCoeffMatrix);

  quad1.brdf.set(this.brdf);

  quad1.surfaceTranslation.scale.set(this.clipperTranslation.scale);
  quad1.surfaceTranslation.rotation = this.clipperTranslation.rotation;
  quad1.surfaceTranslation.rotationAxis.set(this.clipperTranslation.rotationAxis);
  quad1.surfaceTranslation.position.set(this.clipperTranslation.position);

  quad1.clipperTranslation.scale.set(this.additionalClipperTranslation.scale);
  quad1.clipperTranslation.rotation = this.additionalClipperTranslation.rotation;
  quad1.clipperTranslation.rotationAxis.set(this.additionalClipperTranslation.rotationAxis);
  quad1.clipperTranslation.position.set(this.additionalClipperTranslation.position);

  quad1.additionalClipperTranslation.scale.set(this.surfaceTranslation.scale);
  quad1.additionalClipperTranslation.rotation = this.surfaceTranslation.rotation;
  quad1.additionalClipperTranslation.rotationAxis.set(this.surfaceTranslation.rotationAxis);
  quad1.additionalClipperTranslation.position.set(this.surfaceTranslation.position);

  quad2.surfaceCoeffMatrix.set(this.additionalClipperCoeffMatrix);
  quad2.clipperCoeffMatrix.set(this.surfaceCoeffMatrix);
  quad2.additionalClipperCoeffMatrix.set(this.clipperCoeffMatrix);

  quad2.brdf.set(this.brdf);

  quad2.surfaceTranslation.scale.set(this.additionalClipperTranslation.scale);
  quad2.surfaceTranslation.rotation = this.additionalClipperTranslation.rotation;
  quad2.surfaceTranslation.rotationAxis.set(this.additionalClipperTranslation.rotationAxis);
  quad2.surfaceTranslation.position.set(this.additionalClipperTranslation.position);

  quad2.clipperTranslation.scale.set(this.surfaceTranslation.scale);
  quad2.clipperTranslation.rotation = this.surfaceTranslation.rotation;
  quad2.clipperTranslation.rotationAxis.set(this.surfaceTranslation.rotationAxis);
  quad2.clipperTranslation.position.set(this.surfaceTranslation.position);

  quad2.additionalClipperTranslation.scale.set(this.clipperTranslation.scale);
  quad2.additionalClipperTranslation.rotation = this.clipperTranslation.rotation;
  quad2.additionalClipperTranslation.rotationAxis.set(this.clipperTranslation.rotationAxis);
  quad2.additionalClipperTranslation.position.set(this.clipperTranslation.position);

  this.brdf.y = 2;
  quad1.brdf.y = 1;
  quad2.brdf.y = 3;

  this.commitUniforms();
  quad1.commitUniforms();
  quad2.commitUniforms();
};

ClippedQuadric.prototype.completeSingleClippedSolid = function(quad) {
};

ClippedQuadric.prototype.setRotationTogether = function(rotation, axis) {
  return this.setRotationSurface(rotation, axis).
              setRotationClipper(rotation, axis);
};

ClippedQuadric.prototype.setRotationSurface = function (rotation, axis) {
  this.surfaceTranslation.rotation = rotation;

  if(axis && axis.x) this.surfaceTranslation.rotationAxis.set(axis);

  return this;
};

ClippedQuadric.prototype.setRotationClipper = function (rotation, axis) {
  this.clipperTranslation.rotation = rotation;

  if(axis && axis.x) this.clipperTranslation.rotationAxis.set(axis);

  return this;
};
