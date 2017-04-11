var GameObject2D = function(mesh) {
  this.mesh = mesh;

  this.position = new Vec3(0, 0, 0);
  this.orientation = 0;
  this.scale = new Vec3(1, 1, 1);

  this.modelMatrix = new Mat4();
  this.updateModelTransformation();
};

GameObject2D.prototype.updateModelTransformation =
                              function(){
  this.modelMatrix.set().
    scale(this.scale).
    rotate(this.orientation).
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

  Material.shared.uAmbientLight.set(lightSource.ambientLight);

  for(var i = 0; i < lightSource.length; i++) {
    Material.shared.lightPos[i].set(lightSource.lightPosition[i]);
    Material.shared.lightPowerDensity[i].set(lightSource.lightPowerDensity[i]);
  }

  this.mesh.draw();
};

GameObject2D.prototype.move = function(dt) {
  console.warn("Abstract method should be overriden in subclass");
};
