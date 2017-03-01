/**
 * @file WebGLMath UniformReflectionFactories object
 * @copyright Laszlo Szecsi 2017
 */

/**
 * @class UniformReflectionFactories
 * @classdesc A collection of static factory methods that return WebGLMath objects reflecting WebGL uniforms.
 * The purpose is to offer a way of creating objects by ESSL type name and array size.
 */
var UniformReflectionFactories = {
  /**
   * @method float
   * @memberof UniformReflectionFactories
   * @static
   * @description Return a new {@link Vec1} or {@link Vec1Array} with appropriate size.
   * @param {arraySize} - The number of elements in the uniform, if it is an array. For a single float, it must be 1.
   * @return {Vec1 | Vec1Array} The new reflection object.
   */
  float : function(arraySize){ if(arraySize === 1) { return new Vec1(); } else { return new Vec1Array   (arraySize); } },
  /**
   * @method vec2
   * @memberof UniformReflectionFactories
   * @static
   * @description Return a new {@link Vec2} or {@link Vec2Array} with appropriate size.
   * @param {arraySize} - The number of elements in the uniform, if it is an array. For a single vec2, it must be 1.
   * @return {Vec2 | Vec2Array} The new reflection object.
   */
  vec2  : function(arraySize){ if(arraySize === 1) { return new Vec2(); } else { return new Vec2Array   (arraySize); } },
  /**
   * @method vec3
   * @memberof UniformReflectionFactories
   * @static
   * @description Return a new {@link Vec3} or {@link Vec3Array} with appropriate size.
   * @param {arraySize} - The number of elements in the uniform, if it is an array. For a single vec3, it must be 1.
   * @return {Vec3 | Vec3Array} The new reflection object.
   */
  vec3  : function(arraySize){ if(arraySize === 1) { return new Vec3(); } else { return new Vec3Array   (arraySize); } },
  /**
   * @method vec4
   * @memberof UniformReflectionFactories
   * @static
   * @description Return a new {@link Vec4} or {@link Vec4Array} with appropriate size.
   * @param {arraySize} - The number of elements in the uniform, if it is an array. For a single vec4, it must be 1.
   * @return {Vec4 | Vec4Array} The new reflection object.
   */
  vec4  : function(arraySize){ if(arraySize === 1) { return new Vec4(); } else { return new Vec4Array   (arraySize); } },
  /**
   * @method mat4
   * @memberof UniformReflectionFactories
   * @static
   * @description Return a new {@link Mat4} or {@link Mat4Array} with appropriate size.
   * @param {arraySize} - The number of elements in the uniform, if it is an array. For a single mat4, it must be 1.
   * @return {Mat4 | Mat4Array} The new reflection object.
   */
  mat4  : function(arraySize){ if(arraySize === 1) { return new Mat4(); } else { return new Mat4Array   (arraySize); } },
  /**
   * @method mat4
   * @memberof UniformReflectionFactories
   * @static
   * @description Return a new {@link Sampler2D} object.
   * @param {arraySize} - Ignored. There are no Sampler2D arrays in ESSL.
   * @return {Mat4 | Mat4Array} The new reflection object.
   */
  sampler2D :      function(arraySize, samplerIndex){ if(arraySize === 1) { return new Sampler2D(samplerIndex); } else { return new Sampler2DArray(arraySize, samplerIndex);}},
  samplerCube :    function(arraySize, samplerIndex){ if(arraySize === 1) { return new SamplerCube(samplerIndex); } else { return new SamplerCubeArray(arraySize, samplerIndex);}}
};
