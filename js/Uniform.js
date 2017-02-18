var typeMap = {
  "vec2": "uniform2f",
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
  let updateType = typeof(this.gl[updateFnName]);

  // Bind translation uniform
  this.glUniform =
       this.gl.getUniformLocation(this.program.glProgram, this.name);

  // Throw an error if if fails
  if(this.glUniform < 0) {
    throw "The uniform '" + this.name + "' was not found.";
  }

  if(updateType !== "function") {
    // The type of update must be a function
    throw "Expected function. The uniform type '" + type + "' was associated with '" + updateFnName + "', which had the type '" + updateType;
  } else {
    // If the type of update is a function then set the first argument to be
    // this.glUniform and then pass the rest of the arguments along afterwards
    this.update = function () {
        var args = Array.prototype.slice.call(arguments);
        args.unshift(this.glUniform);

        this.gl[updateFnName].apply(this.gl, args);
    }
  }
};

