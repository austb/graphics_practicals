var LightSource = function(size) {
  this.lightPowerDensity = new Vec4Array(size);
  this.lightPositionOrDirection = new Vec4Array(size);
  this.length = size;
};

LightSource.prototype.updateUniforms = function() {
  for(var i = 0; i < this.length; i++) {
    Material.shared.lightPos[i].set(this.lightPositionOrDirection[i]);
    Material.shared.lightPowerDensity[i].set(this.lightPowerDensity[i]);
  }
};


LightSource.prototype.setPointLight = function(index, position, powerDensity) {
  this.lightPositionOrDirection[index].set(new Vec4(position, 1));

  if(powerDensity) {
    this.lightPowerDensity[index].set(new Vec4(powerDensity, 1));
  }
};

LightSource.prototype.setDirectionalLight = function(index, direction, powerDensity) {
  this.lightPositionOrDirection[index].set(direction.x, direction.y, direction.z, 0.0);
  this.lightPositionOrDirection[index].normalize();

  if(powerDensity) {
    this.lightPowerDensity[index].set(new Vec4(powerDensity, 0.0));
  }
};

var positionOrDirectionFn = function(index) {
  return this.lightPositionOrDirection[index];
};
LightSource.prototype.getLightDirection = positionOrDirectionFn;
LightSource.prototype.getLightPosition = positionOrDirectionFn;
