var Position = function(x, y) {
  this.data = [x, y];
};

Position.addX = function(pos, dx) {
  var newX = pos.getX() + dx;

  return new Position(newX, pos.getY());
};

Position.addY = function(pos, dy) {
  var newY = pos.getY() + dy;

  return new Position(pos.getX(), newY);
};

Position.addXY = function(pos, dx, dy) {
  var newX = pos.getX() + dx;
  var newY = pos.getY() + dy;

  return new Position(newX, newY);
};

Position.add = function(pos1, pos2) {
  var x = pos2.getX();
  var y = pos2.getY();

  return Position.addXY(pos1, x, y);
};

Position.prototype.equals = function(pos) {
  return this.data.equals(pos.data);
};

Position.prototype.getX = function() {
  return this.data[0];
};

Position.prototype.getY = function() {
  return this.data[1];
};

Position.prototype.first = function() {
  return this.getX();
};

Position.prototype.second = function() {
  return this.getY();
};
