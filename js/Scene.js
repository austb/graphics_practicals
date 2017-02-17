var Scene = function(gl, output) {

  this.triangleRotation = 0;
  this.trianglePosition = {x:0, y:0, z:0};
  this.timeAtLastFrame = new Date().getTime();

  this.vertexShader = new Shader(gl, gl.VERTEX_SHADER, "idle_vs.essl");
  this.fragmentShader = new Shader(gl, gl.FRAGMENT_SHADER, "blue_fs.essl");

  // shader program
  this.program = new Program(gl, this.vertexShader, this.fragmentShader);

  // The shape
  this.quadGeometry = new QuadGeometry(gl);
}

Scene.prototype.update = function(gl) {
  // set clear color (part of the OpenGL render state)
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  // clear the screen
  gl.clear(gl.COLOR_BUFFER_BIT);

  // set shader program to use
  this.program.commit();
  this.quadGeometry.draw();

  // dt
  var timeAtThisFrame = new Date().getTime();
  var dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
  this.timeAtLastFrame = timeAtThisFrame;
    
  // triangle translation
  this.trianglePosition.x += 0.5 * dt;

  // triangle rotation
  this.triangleRotation += 0.3 * dt;
}
