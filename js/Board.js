var Board = (function() {

  var STARTING_BOARD_SIZE = 2;
  var ORIGIN = new Position(0, 0);

  var Board = function(size) {
    this.size = STARTING_BOARD_SIZE;

    if(size > this.size) {
      this.size = size;
    }

    this.selectedPos = new Position(0, 0);
    this.startPos = new Position(1, 0);
    this.endPos = new Position(0, 1);

    this.board = {};
    this.path = [];

    var sizeIndex = this.size - 1;
    for(var i = -sizeIndex; i < this.size; i++) {
      this.board[i] = {};

      var nextStart;
      var end;
      if ( i <= 0 ){
        nextStart = -(i + sizeIndex);
        end = this.size;
      } else {
        nextStart = -sizeIndex;
        end = this.size - i;
      }

      for(var j = nextStart; j < end; j++) {
        this.board[i][j] = new Tile();
      }
    }
  };

  Board.prototype.moveSelected = function(x, y) {
    this.selectedPos = Position.addXY(this.selectedPos, x, y);
  };

  Board.prototype.setStartFromSelected = function() {
    var x = this.selectedPos.getX();
    var y = this.selectedPos.getY();

    this.board[x][y].setIsWall(false);

    this.startPos = new Position(x, y);
  };

  Board.prototype.setEndFromSelected = function() {
    var x = this.selectedPos.getX();
    var y = this.selectedPos.getY();

    this.board[x][y].setIsWall(false);

    this.endPos = new Position(x, y);
  };

  Board.prototype.isWall = function(x, y) {
    return this.board[x][y].getIsWall();
  };

  Board.prototype.toggleWall = function() {
    var x = this.selectedPos.getX();
    var y = this.selectedPos.getY();

    if(!this.isEndPos(x, y) && ! this.isStartPos(x, y)) {
      this.board[x][y].setIsWall(!this.board[x][y].getIsWall());
    }
  };

  Board.prototype.isSelectedPos = function(x, y) {
    return this.selectedPos.equals(new Position(x, y));
  };

  Board.prototype.isStartPos = function(x, y) {
    return this.startPos.equals(new Position(x, y));
  };

  Board.prototype.isEndPos = function(x, y) {
    return this.endPos.equals(new Position(x, y));
  };

  Board.prototype.isOnPath = function(x, y) {
    for(var i = 0; i < this.path.length; i++) {
      if(this.path[i].equals(new Position(x, y))) {
        return true;
      }
    }
    return false;
  };

  Board.prototype.getTileAtPos = function(pos) {
    var x = pos.getX();
    var y = pos.getY();

    return this.board[x][y];
  };

  Board.prototype.manhattanDistance = function(p0, p1) {
    var dx = p1.getX() - p0.getX();
    var dy = p1.getY() - p0.getY();

    if (Math.sign(dx) == Math.sign(dy)) {
      return Math.abs(dx + dy);
    } else {
      return Math.max(Math.abs(dx), Math.abs(dy));
    }
  };

  Board.prototype.neighbors = function(pos) {
    var neighbors = [];

    neighbors.push(Position.addX(pos, 1));
    neighbors.push(Position.addX(pos, -1));
    neighbors.push(Position.addY(pos, 1));
    neighbors.push(Position.addY(pos, -1));
    neighbors.push(Position.addXY(pos, 1, -1));
    neighbors.push(Position.addXY(pos, -1, 1));

    for(var i = 0; i < neighbors.length; i++) {
      var check = neighbors[i];
      if(this.manhattanDistance(check, ORIGIN) >= this.size) {
        neighbors.splice(i, 1);
        i--;
      }
    }

    return neighbors;
  };

  Board.prototype.containsPos = function(arr, pos) {
    for(var i = 0; i < arr.length; i++) {
      if(arr[i].value.equals(pos)) {
        return true;
      }
    }
    return false;
  };

  Board.prototype.generatePath = function() {
    var node = {
      value: this.startPos,
      priority: 0,
      cost: 0,
      parent: null
    };
    var neighbors;

    var frontier = new TinyQueue([node], function (a, b) {
      return a.priority - b.priority;
    });

    var explored = [];

    while(frontier.length > 0) {
      node = frontier.pop();

      if(node.value.equals(this.endPos)) {
        return node;
      } else {
        explored.push(node);
        neighbors = this.neighbors(node.value);

        var tile;
        var oldCost;
        var aStarPathCost;
        for(var i = 0; i < neighbors.length; i++) {
          tile = this.getTileAtPos(neighbors[i]);
          oldCost = node.cost;
          aStarPathCost = node.cost + tile.getPathCost() + this.manhattanDistance(neighbors[i], this.endPos);
          if(!tile.getIsWall()
            && !this.containsPos(explored, neighbors[i])
            && !frontier.contains(neighbors[i])) {

            frontier.push({
              value: neighbors[i],
              priority: aStarPathCost,
              cost: oldCost + tile.getPathCost(),
              parent: node
            });
          }
        }
      }
    }

  };

  Board.prototype.pathToArray = function(nodeChain) {
    this.path = [];
    var node = nodeChain;

    while(node !== null) {
      this.path.push(node.value);
      node = node.parent;
    }
  };

  Board.prototype.findPath = function() {
    var nodeChain = this.generatePath();

    this.pathToArray(nodeChain);
  };

  return Board;

})();
