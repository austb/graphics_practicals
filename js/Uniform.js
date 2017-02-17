var typeMap = {
  "vec3": "uniform3f"
};

var typeToFnName = function(type) {
  return typeMap[type];
};

//
// Start of Uniform clas
//
var Uniform = function(program, name, type) {
  this.program = program;
  this.gl = program.gl;
  this.name = name;
  let updateFnName = typeToFnName(type);

  // Bind translation uniform
  this.glUniform =
       this.gl.getUniformLocation(this.program.glProgram, this.name);

  if(this.glUniform < 0) {
    throw "The uniform '" + this.name + "' was not found.";
  }

  let updateType = typeof(this.gl[updateFnName]);
  if(updateType !== "function") {
    throw "Expected function. The uniform type '" + type + "' was associated with '" + updateFnName + "', which had the type '" + updateType;
  } else {
    this.update = function () {
        var args = Array.prototype.slice.call(arguments);
        args.unshift(this.glUniform);

        this.gl[updateFnName].apply(this.gl, args);
    }
  }
};

