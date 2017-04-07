var Material = function(gl, program) {
  this.gl = gl;
  this.program = program;
  var theMaterial = this;
  Object.keys(program.uniforms).forEach(function(uniformName) {
    var uniform = program.uniforms[uniformName];
    var reflectionVariable =
        UniformReflectionFactories.makeVar(gl, uniform.type,
                   uniform.arraySize, uniform.textureUnit);

    if(uniformName in Material.shared){
      if(Material.shared[uniformName]){
        if(typeof Material.shared[uniformName] !== typeof reflectionVariable) {
          throw new Error(
            "Conflicting definitions of shared uniform ' " + uniformName + "'.");
        }
      } else {
        Object.defineProperty(Material.shared,
              uniformName, {value: reflectionVariable} );
      }
    } else {
      Object.defineProperty(theMaterial, uniformName,
        {value: reflectionVariable} );
    }
  });

  // at the end of Material’s constructor
  return new Proxy(this, {
    get : function(target, name){
      if(!(name in target)){
        console.error(
          "WARNING: Ignoring attempt" +
          " to access material property '" +
          name + "'. Is '" + name +
          "' an unused uniform?" );
        return Material.dummy;
      }
      return target[name];
    },
  });
};

Material.dummy = new Proxy(new Function(), {
  get: function(target, name){
    return Material.dummy;
  },
  apply: function(target, thisArg, args){
    return Material.dummy;
  },
});

Material.prototype.commit = function() {
  var gl = this.gl;
  this.program.commit();
  var theMaterial = this;
  Object.keys(this.program.uniforms).forEach( function(uniformName) {
    var uniform = theMaterial.program.uniforms[uniformName];
    if(uniformName in Material.shared) {
      Material.shared[uniformName].commit(
        gl, uniform.location);
    } else {
      theMaterial[uniformName].commit(
        gl, uniform.location);
    }
  });
};
