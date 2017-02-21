var Program = function(gl, vertexShader, fragmentShader, attribs) {
  this.gl = gl;
  this.sourceFileNames = {vs:vertexShader.sourceFileName,
                          fs:fragmentShader.sourceFileName};
  this.glProgram = gl.createProgram();
  gl.attachShader(this.glProgram, vertexShader.glShader);
  gl.attachShader(this.glProgram, fragmentShader.glShader);

  for(var i = 0; i < attribs.length; i+=1) {
    gl.bindAttribLocation(this.glProgram, i, attribs[i]);
  }

  gl.linkProgram(this.glProgram);
  if (!gl.getProgramParameter(this.glProgram, gl.LINK_STATUS)) {
    throw new Error('Could not link shaders [vertex shader:' + vertexShader.sourceFileName +
                                         ']:[fragment shader: ' + fragmentShader.sourceFileName + ']\n' + gl.getProgramInfoLog(this.glProgram));
  }
};

Program.prototype.getUniform = function(name, type) {
  return new Uniform(this, name, type);
};

Program.prototype.use = function(){
  this.gl.useProgram(this.glProgram);
};
