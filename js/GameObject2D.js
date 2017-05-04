var GameObject2D = function(mesh) {
  this.mesh = mesh;

  this.position = new Vec3(0, 0, 0);
  this.orientation = new Vec3(0, 0, 0);
  this.scale = new Vec3(1, 1, 1);

  this.modelMatrix = new Mat4();
  this.updateModelTransformation();
};

var unitVecX = new Vec3(1, 0, 0);
var unitVecY = new Vec3(0, 1, 0);
var unitVecZ = new Vec3(0, 0, 1);
GameObject2D.prototype.updateModelTransformation =
                              function(){
    this.modelMatrix.set().
      scale(this.scale).
      rotate(this.orientation.x, unitVecX).
      rotate(this.orientation.y, unitVecY).
      rotate(this.orientation.z, unitVecZ).
      translate(this.position);
};

GameObject2D.prototype.drawAsShadow = function(cam, ls){
  var d = ls.getLightDirection(0);

  var shadowProjMatrix = new Mat4();
  shadowProjMatrix.set(
      1, 0, 0, 0,
      -d.x / d.y , 0, -d.z / d.y, 0,
      0, 0, 1, 0,
      0, 0.1, 0, 1
    );

  this.setMVP(cam, this.parent, shadowProjMatrix);

  this.mesh.draw();
};

GameObject2D.prototype.setMVP = function(camera, parent, shadowProjMatrix) {
  if(!parent) {
    parent = {
      modelMatrix: new Mat4()
    };
  }

  if(!shadowProjMatrix) {
    shadowProjMatrix = new Mat4();
  }

  Material.shared.modelViewProjMatrix.set().
    mul(this.modelMatrix).
    mul(parent.modelMatrix).
    mul(shadowProjMatrix).
    mul(camera.viewProjMatrix);
};


GameObject2D.prototype.draw = function(camera, lightSource){
  this.setMVP(camera, this.parent);

  this.mesh.draw();
};

GameObject2D.prototype.move = function(dt) {
  console.warn("Abstract method should be overriden in subclass");
};
