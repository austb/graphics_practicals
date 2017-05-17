shaderSource[document.currentScript.src.split('js/shaders/')[1]] = `
  attribute vec3 vertexPosition;
  attribute vec3 vertexNormal;
  attribute vec2 vertexTexCoord;

  uniform mat4 rayDirMatrix;
  varying vec3 rayDir;

  void main(void) {
    vec4 homogenous_pos = vec4(vertexPosition, 1.0);

    gl_Position = homogenous_pos;

    rayDir = (homogenous_pos * rayDirMatrix).xyz;
  }

`;
