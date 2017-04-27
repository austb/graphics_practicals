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

GameObject2D.prototype.draw = function(camera, lightSource){

  if(this.parent) {
    Material.shared.modelViewProjMatrix.set().
      mul(this.modelMatrix).
      mul(this.parent.modelMatrix).
      mul(camera.viewProjMatrix);
  } else {
    Material.shared.modelViewProjMatrix.set().
      mul(this.modelMatrix).
      mul(camera.viewProjMatrix);
  }

  this.mesh.draw();
};

GameObject2D.prototype.move = function(dt) {
  console.warn("Abstract method should be overriden in subclass");
};
