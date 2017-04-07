var LightSource = function(size) {
  this.lightPowerDensity = new Vec4Array(size);
  this.lightPosition = new Vec4Array(size);
};

LightSource.prototype.set = function(index, direction, powerDensity) {
  this.lightPosition[index].set(new Vec4(direction, 0));

  if(powerDensity) {
    this.lightPowerDensity[index].set(new Vec4(powerDensity, 1));
  }
};
