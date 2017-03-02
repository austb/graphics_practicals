function handleTextureLoaded(scene, image, texture) {
  var gl = scene.gl;
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.bindTexture(gl.TEXTURE_2D, null);
  scene.textureLoaded = true;
}

var ANIM_RATE=0.10;

var Scene = function(gl, output) {

  this.gl = gl;

  this.isMoving = false;
  this.isSpinning = false;
  this.triangleRotation = 0;
  this.trianglePosition = {x:0, y:0, z:0};
  this.timeSinceLastSpriteChange = 0;
  this.spriteOffset = {x: 0, y: 0, z: 0};
  this.timeAtLastFrame = new Date().getTime();

  this.vertexShader = new Shader(gl, gl.VERTEX_SHADER, "idle_vs.essl");
  this.fragmentShader = new Shader(gl, gl.FRAGMENT_SHADER, "blue_fs.essl");

  // shader program
  var triangleAttribs = ['vertexPosition', 'vertexNormal', 'vertexTexCoord'];
  this.program = new Program(gl, this.vertexShader, this.fragmentShader, triangleAttribs);

  var triangleVertices = new Vec3Array(4);
  triangleVertices[0].set(new Vec3(1, 1, 0.0));
  triangleVertices[1].set(new Vec3(1, -1, 0.0));
  triangleVertices[2].set(new Vec3(-1, 1, 0.0));
  triangleVertices[3].set(new Vec3(-1, -1, 0.0));

  // The shape
  this.quadGeometry = new QuadGeometry(gl, triangleVertices);

  this.modelMatrixUniformLocation = gl.getUniformLocation(this.program.glProgram, "modelMatrix");

  this.textureLoaded = false;
  var self = this;
  this.dragonTexture = gl.createTexture();
  this.dragonImage = new Image();
  this.dragonImage.onload = function() { handleTextureLoaded(self, self.dragonImage, self.dragonTexture); };
  this.dragonImage.src = 'img/dragon_red.png';

  this.sampler = new Sampler2D(0);
  this.sampler.set(this.dragonTexture);
  this.samplerUniform = gl.getUniformLocation(this.program.glProgram, "colorTexture");

  this.samplerTransform = gl.getUniformLocation(this.program.glProgram, "samplerTransform");
};

Scene.prototype.toggleTranslation = function() {
  this.isMoving = !this.isMoving;
};

Scene.prototype.toggleRotation = function() {
  this.isSpinning = !this.isSpinning;
};

Scene.prototype.resetScene = function() {
  this.trianglePosition = {x:0, y:0, z:0};
  this.triangleRotation = 0;
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

  if(this.textureLoaded) {
    // set shader program to use
    this.program.use();

    var modelMatrix;
    var width = gl.canvas.clientWidth;
    var height = gl.canvas.clientHeight;
    var preventStretching = {};
    // if (width >= height) {
    if (false) {
      preventStretching = {
        x : 1,
        y : width/height
      };
    } else {
      preventStretching = {
        x : height/width,
        y : 1,
      };
    }

    if(this.samplerUniform === null) {
      console.log("Could not find uniform samplerUniform");
    } else {
      this.sampler.commit(gl, this.samplerUniform);
    }

    if(this.samplerTransform === null) {
      console.log("Could not find uniform samplerTransform.");
    } else {
      var scale = {x: 8, y: 1, z: 1};
      var samplerMat = new Mat4().scale(scale).translate(this.spriteOffset);
      samplerMat.invert();
      samplerMat.commit(gl, this.samplerTransform);
    }

    if(this.modelMatrixUniformLocation === null) {
      console.log("Could not find uniform modelMatrix.");
    } else {
      modelMatrix = new Mat4().scale({x:-1, y:1, z:1}).rotate(-1 * this.triangleRotation).translate(this.trianglePosition).scale(0.25).scale(preventStretching);
      // modelMatrix = new Mat4().scale(0.10);
      modelMatrix.commit(gl, this.modelMatrixUniformLocation);
    }

    this.quadGeometry.draw();

    if(this.modelMatrixUniformLocation === null) {
      console.log("Could not find uniform modelMatrix.");
    } else {
      modelMatrix = new Mat4().rotate(this.triangleRotation).translate(-1 * this.trianglePosition.x).scale(0.25).scale(preventStretching);
      modelMatrix.commit(gl, this.modelMatrixUniformLocation);
    }

    // this.quadGeometry.draw();

    // dt
    var timeAtThisFrame = new Date().getTime();
    var dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
    this.timeAtLastFrame = timeAtThisFrame;

    this.timeSinceLastSpriteChange += dt;

    if(this.timeSinceLastSpriteChange >= ANIM_RATE) {
      this.spriteOffset.x += 1;
      this.spriteOffset.x %= 8;
      this.timeSinceLastSpriteChange = 0;
      console.log(this.spriteOffset);
    }

    // triangle translation
    if(this.isMoving) {
      this.trianglePosition.x += 0.8 * dt;
    }

    // triangle rotation
    if(this.isSpinning) {
      this.triangleRotation += 0.3 * dt;
    }
  }
};
