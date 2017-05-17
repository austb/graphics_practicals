shaderSource[document.currentScript.src.split('js/shaders/')[1]] = `
  precision highp float;

  uniform sampler2D environmentSphericalTexture;

  uniform vec3 uCameraPos;
  uniform mat4 quadrics[32];
  uniform vec4 brdfs[16];

  // Light
  uniform vec4 lightPos[2]; // xyz is the direction, w is 0
  uniform vec4 lightPowerDensity[2]; // w ignored

  uniform vec3 uMaterialShinyColor;
  uniform highp float uShinyFactor;

  varying vec3 rayDir;

  vec2 calculatePossibleIntersectionPoints(mat4 quadric, vec4 rayOrigin, vec4 rayDirection) {
    highp float a = dot(rayDirection * quadric, rayDirection);
    highp float b = dot(rayDirection * quadric, rayOrigin) + dot(rayOrigin * quadric, rayDirection);
    highp float c = dot(rayOrigin * quadric, rayOrigin);

    highp float discriminant = (b * b) - (4.0 * a * c);

    if(discriminant < 0.0) {
      return vec2(-1.0, -1.0);
    }

    highp float t1 = (-b + sqrt(discriminant)) / (2.0 * a);
    highp float t2 = (-b - sqrt(discriminant)) / (2.0 * a);

    return vec2(t1, t2);
  }

  highp float intersectQuadric(mat4 quadric, vec4 rayOrigin, vec4 rayDirection) {
    vec2 tVals = calculatePossibleIntersectionPoints(quadric, rayOrigin, rayDirection);

    highp float t1, t2;
    t1 = tVals.x;
    t2 = tVals.y;

    highp float t = min(t1, t2);
    if(t < 0.0) {
      return max(t1, t2);
    }
    return t;
  }

  highp float intersectClippedQuadric(mat4 quadric, mat4 clipShape, vec4 rayOrigin, vec4 rayDirection) {
    vec2 tVals = calculatePossibleIntersectionPoints(quadric, rayOrigin, rayDirection);

    highp float t1, t2;
    t1 = tVals.x;
    t2 = tVals.y;

    highp vec4 r = rayOrigin + rayDirection * t1;
    highp float hit1 = dot(r * clipShape, r);
    if(hit1 < 0.0) {
      t1 = -1.0;
    }

    r = rayOrigin + rayDirection * t2;
    highp float hit2 = dot(r * clipShape, r);
    if(hit2 < 0.0) {
      t2 = -1.0;
    }

    highp float t = min(t1, t2);
    if(t < 0.0) {
      return max(t1, t2);
    }
    return t;
  }

  vec3 computeQuadricNormal(mat4 quadric, vec4 rayToQuadSurface) {
    return normalize((quadric * rayToQuadSurface + rayToQuadSurface * quadric).xyz);
  }

  void computeWorldPositionAndNormal(in vec4 rayOrigin, in vec4 rayDirection, in highp float t, in mat4 shape, out vec3 world_pos, out vec3 shapeNormal) {
    highp vec4 rayToQuadric = rayOrigin + rayDirection * t;

    vec3 tmpNormal = computeQuadricNormal(shape, rayToQuadric);

    // Light inside of a shape if it is facing camera
    if(dot(rayDirection.xyz, tmpNormal) > 0.0) {
      tmpNormal = -tmpNormal;
    }

    world_pos = rayToQuadric.xyz;
    shapeNormal = tmpNormal;
  }

  bool findBestHit(in vec4 rayOrigin, in vec4 rayDirection, out highp float bestT, out vec4 bestBRDF, out mat4 bestA) {
    bestT = -1.0;
    bool isIntersection = false;
    highp float newT;

    for(int i = 0; i < 16; i++) {
      newT = intersectClippedQuadric(quadrics[2 * i], quadrics[2 * i + 1], rayOrigin, rayDirection);

      if(newT > 0.0 && (newT < bestT || bestT < 0.0)) {
        bestT = newT;
        bestBRDF = brdfs[i];
        bestA = quadrics[2 * i];

        isIntersection = true;
      }
    }

    return isIntersection;
  }

  void main(void) {
    vec4 e = vec4(uCameraPos, 1.0);
    vec4 d = vec4(normalize(rayDir), 0.0);

    highp float t;
    vec4 brdf;
    mat4 shape;
    if (findBestHit(e, d, t, brdf, shape)) {

      vec3 worldPos;
      vec3 quadricNormal;
      computeWorldPositionAndNormal(e, d, t, shape, worldPos, quadricNormal);
      vec3 viewDir = normalize(uCameraPos - worldPos);

      if(brdf.a > 200.0) {
        vec3 reflectionColor;
        vec3 contrib = vec3(1.0, 1.0, 1.0);

        highp float reflect_t;
        vec4 reflect_brdf;
        mat4 reflect_shape;

        vec4 reflectingRay = vec4(reflect(-viewDir, quadricNormal), 0.0);
        vec4 reflectPosition = vec4(worldPos + (0.01 * quadricNormal), 1.0);
        for(int i = 0; i < 10; i++) {
          if (findBestHit(reflectPosition, reflectingRay, reflect_t, reflect_brdf, reflect_shape)) {
            if(reflect_brdf.a > 200.0) {
              vec3 reflectedWorldPos;
              vec3 reflectedNormal;
              computeWorldPositionAndNormal(reflectPosition, reflectingRay, reflect_t, reflect_shape, reflectedWorldPos, reflectedNormal);

              reflectionColor += (vec3(1.0, 0.0, 0.0) * contrib);

              // Set up next step
              contrib *= reflect_brdf.rgb;
              reflectingRay = vec4(reflect(reflectingRay.xyz, reflectedNormal), 0.0);
              reflectPosition = vec4(reflectedWorldPos + (0.01 * reflectedNormal), 1.0);

              break;
            } else {
              // TODO: Phong-Blinn/shadow shading in mirror?
              reflectionColor += (reflect_brdf.rgb * contrib);
              break;
            }

          } else {
            vec2 probeTex = (normalize(vec3(0, 0, 1) + normalize(reflectingRay.xyz)).xy / vec2(2, -2)) + vec2(0.5, 0.5);
            reflectionColor += (texture2D(environmentSphericalTexture, probeTex).rgb * contrib);
            break;
          }
        }

        gl_FragColor = vec4(reflectionColor, 1.0);

      } else { 
        vec3 diffuseComponent;
        vec3 shinyComponent;

        for(int i = 0; i < 2; i++) {
          vec3 lightDirection = lightPos[i].xyz - (worldPos * lightPos[i].w);

          highp float shadow_t;
          vec4 shadow_brdf;
          mat4 shadow_shape;
          if(findBestHit(vec4(worldPos + (0.01 * quadricNormal), 1.0),
                         vec4(normalize(lightDirection), 0.0),
                         shadow_t, shadow_brdf, shadow_shape)) continue;

          highp float powerMagnitude = 1.0 / dot(lightDirection, lightDirection);
          vec3 powerMag = lightPowerDensity[i].xyz * powerMagnitude;

          highp float directionalComponent = max(dot(normalize(lightDirection), quadricNormal), 0.0);
          diffuseComponent += powerMag * directionalComponent;

          if(brdf.a > 0.0 && brdf.a < 200.0) {
            vec3 halfway = normalize(viewDir + normalize(lightDirection));
            shinyComponent += powerMag * vec3(1.0, 1.0, 1.0) * pow(max(dot(quadricNormal, halfway), 0.0), brdf.a);
          }
        }

        gl_FragColor = vec4(brdf.rgb * diffuseComponent + shinyComponent, 1.0);
      }
    } else {
      vec2 probeTex = (normalize(vec3(0, 0, 1) + normalize(rayDir)).xy / vec2(2, -2)) + vec2(0.5, 0.5);
      gl_FragColor = texture2D(environmentSphericalTexture, probeTex);
    }
  }
`;
