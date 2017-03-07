var ANIM_RATE=0.10;

var Scene = function(gl, output) {

  this.gl = gl;

  this.walls = [];
  this.board = new Board(15);

  this.vertexShader = new Shader(gl, gl.VERTEX_SHADER, "idle_vs.essl");
  this.fragmentShader = new Shader(gl, gl.FRAGMENT_SHADER, "black_fs.essl");

  // shader program
  var triangleAttribs = ['vertexPosition', 'vertexNormal', 'vertexTexCoord'];
  this.program = new Program(gl, this.vertexShader, this.fragmentShader, triangleAttribs);

  this.material = new Material(gl, this.program);

  var triangleVertices = new Vec3Array(7);
  triangleVertices[0].set(new Vec3(0.0, 0.0, 0.0));
  triangleVertices[1].set(new Vec3(-0.5, 1.0, 0.0));
  triangleVertices[2].set(new Vec3(0.5, 1.0, 0.0));
  triangleVertices[3].set(new Vec3(1.0, 0.0, 0.0));
  triangleVertices[4].set(new Vec3(0.5, -1.0, 0.0));
  triangleVertices[5].set(new Vec3(-0.5, -1.0, 0.0));
  triangleVertices[6].set(new Vec3(-1.0, 0.0, 0.0));

  // The shape
  this.quadGeometry = new QuadGeometry(gl, triangleVertices, this.material);

  this.calculatePath();
};

Scene.prototype.moveSelected = function(x, y) {
  this.board.moveSelected(x, y);
};


Scene.prototype.addWallAtSelected = function() {
  this.board.toggleWall();

  this.calculatePath();
};

Scene.prototype.moveStartToSelected = function() {
  this.board.setStartFromSelected();

  this.calculatePath();
};

Scene.prototype.moveEndToSelected = function() {
  this.board.setEndFromSelected();

  this.calculatePath();
};

Scene.prototype.calculatePath = function() {
  this.board.findPath();
};

Scene.prototype.update = function(gl) {
  // set clear color (part of the OpenGL render state)
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  // clear the screen
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.enable(gl.BLEND);
  gl.blendFunc(
    gl.SRC_ALPHA,
    gl.ONE_MINUS_SRC_ALPHA);

  // set shader program to use
  this.program.commit();

  var modelMatrix;
  var width = gl.canvas.clientWidth;
  var height = gl.canvas.clientHeight;
  var preventStretching = {};
  preventStretching = {
    x : height/width,
    y : 1,
  };

  var size = this.board.size;
  var sizeIndex = size - 1;
  var iOffset;
  var jOffset;
  for(var i = -sizeIndex; i < size; i++) {

    var nextStart;
    var end;
    if ( i <= 0 ){
      nextStart = -(i + sizeIndex);
      end = size;
    } else {
      nextStart = -sizeIndex;
      end = size - i;
    }

    for(var j = nextStart; j < end; j++) {
      iOffset = new Vec3(-1.5, 1.0, 0.0);
      jOffset = new Vec3(1.5, 1.0, 0.0);

      iOffset.mul(i);
      jOffset.mul(j+i);

      modelMatrix = new Mat4().translate(iOffset).translate(jOffset).scale(1/(size*2)).scale(preventStretching);
      Material.shared.modelMatrix.set(modelMatrix);

      if (this.board.isSelectedPos(i, j)) {
        this.material.color.set(new Vec4(0.0, 0.0, 1.0, 1.0));
      } else if (this.board.isStartPos(i, j)) {
        this.material.color.set(new Vec4(0.0, 1.0, 0.0, 1.0));
      } else if (this.board.isEndPos(i, j)) {
        this.material.color.set(new Vec4(1.0, 0.0, 0.0, 1.0));
      } else if (this.board.isOnPath(i, j)) {
        this.material.color.set(new Vec4(0.5, 0.5, 0.5, 1.0));
      } else {
        var drawColor = new Vec4(1.0, 1.0, 1.0, 1.0);

        if(this.board.isWall(i, j)) {
          drawColor = new Vec4(0.0, 0.0, 0.0, 1.0);
        }

        this.material.color.set(drawColor);
      }

      this.material.commit();
      this.quadGeometry.draw();
    }
  }

  // dt
  var timeAtThisFrame = new Date().getTime();
  var dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
  this.timeAtLastFrame = timeAtThisFrame;

};
