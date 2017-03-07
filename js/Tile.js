var Tile = (function() {

  var constructor = function() {
    this.pathCost = 1;
    this.isWall = false;
  };

  constructor.prototype.setPathCost = function(value) {
    this.pathCost = value;
  };

  constructor.prototype.getPathCost = function() {
    return this.pathCost;
  };

  constructor.prototype.getIsWall = function() {
    return this.isWall;
  };

  constructor.prototype.setIsWall = function(newVal) {
    this.isWall = newVal;
  };

  return constructor;
})();
