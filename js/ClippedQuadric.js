var ClippedQuadric = function(material, quadricNumber) {
  this.material = material;
  this.quadricNumber = quadricNumber;
  this.surfaceCoeffMatrix = new Mat4();
  this.clipperCoeffMatrix = new Mat4();

  this.surfaceTranslation = {};
  this.surfaceTranslation.scale = new Vec3(1, 1, 1);
  this.surfaceTranslation.rotation = 0;
  this.surfaceTranslation.position = new Vec3();

  this.clipperTranslation = {};
  this.clipperTranslation.scale = new Vec3(1, 1, 1);
  this.clipperTranslation.rotation = 0;
  this.clipperTranslation.position = new Vec3(0, 0, 0);

  this.brdf = new Vec4();
};

ClippedQuadric.prototype.setDiffuseColor = function(r, g, b) {
  return this.setDiffuseColorWithShininess(r, g, b, 0);
};

ClippedQuadric.prototype.setDiffuseColorWithShininess = function(r, g, b, s) {
  this.brdf.set(r, g, b, s);

  return this;
};

ClippedQuadric.prototype.setSurfaceMirrorReflectance = function(r, g, b) {
  this.brdf.set(r, g, b, 201);

  return this;
};

ClippedQuadric.prototype.commitUniforms = function() {
  var trans = new Mat4().
    scale(this.surfaceTranslation.scale).
    rotate(this.surfaceTranslation.rotation).
    translate(this.surfaceTranslation.position).invert();
  this.material.quadrics[2 * this.quadricNumber].set(this.surfaceCoeffMatrix).
      premul(trans).
      mul(new Mat4(trans).transpose());

  trans = new Mat4().
    scale(this.clipperTranslation.scale).
    rotate(this.clipperTranslation.rotation).
    translate(this.clipperTranslation.position).invert();
  this.material.quadrics[2 * this.quadricNumber + 1].set(this.clipperCoeffMatrix).
      premul(trans).
      mul(new Mat4(trans).transpose());

  this.material.brdfs[this.quadricNumber].set(this.brdf);
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

  return this;
};
