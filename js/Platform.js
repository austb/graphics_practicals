var makePlatormAtPositionFn = function(scene, gl, program, quadGeometry) {
  var material, platformMesh, platformEndMesh, jovianMesh;

  material = new Material(gl, program);
  material.colorTexture.set(
    new Texture2D(gl, 'img/platform.png'));

  platformMesh = new Mesh(quadGeometry, material);

  material = new Material(gl, program);
  material.colorTexture.set(
    new Texture2D(gl, 'img/platformend.png'));

  platformEndMesh = new Mesh(quadGeometry, material);

  material = new Material(gl, program);
  material.colorTexture.set(
    new Texture2D(gl, 'img/jovian.png'));

  jovianMesh = new Mesh(quadGeometry, material);

  return function(position) {
    var platformCL = new AnimatedGameObject2D(platformMesh, {spriteDimensions: {x: 1, y: 1}});
    platformCL.physics.position.set(position.plus(-1, 0, 0));
    platformCL.disableAllEnvironmentForces();
    rectangleCollidesWithLanderFn(platformCL, platformCollisionWithLanderAction);

    var platformCR = new AnimatedGameObject2D(platformMesh, {spriteDimensions: {x: 1, y: 1}});
    platformCR.physics.position.set(position.plus(1, 0 ,0));
    platformCR.disableAllEnvironmentForces();
    rectangleCollidesWithLanderFn(platformCR, platformCollisionWithLanderAction);

    var platformEndLeft = new AnimatedGameObject2D(platformEndMesh, {spriteDimensions: {x: 1, y: 1}});
    platformEndLeft.physics.position.set(-2.0, 0, 0);
    platformEndLeft.parent = platformCL;
    platformEndLeft.disableAllEnvironmentForces();
    platformEndLeft.bounds = {
      radius: 0.8
    };
    collidesWithLanderFn(platformEndLeft, platformCollisionWithLanderAction);

    var platformEndRight = new AnimatedGameObject2D(platformEndMesh, {spriteDimensions: {x: 1, y: 1}});
    platformEndRight.physics.position.set(2.0, 0, 0);
    platformEndRight.parent = platformCR;
    platformEndRight.scale.set(-1, 1, 1);
    platformEndRight.disableAllEnvironmentForces();
    platformEndRight.bounds = {
      radius: 0.8
    };
    collidesWithLanderFn(platformEndRight, platformCollisionWithLanderAction);

    platformCL.collidesWithJovian = true;
    platformCR.collidesWithJovian = true;
    platformEndLeft.collidesWithJovian = true;
    platformEndRight.collidesWithJovian = true;

    platformCL.centerOfPlatform = position;
    platformCR.centerOfPlatform = position;
    platformEndLeft.centerOfPlatform = position;
    platformEndRight.centerOfPlatform = position;

    platformCL.platformWidth = 4.0;
    platformCR.platformWidth = 4.0;
    platformEndLeft.platformWidth = 4.0;
    platformEndRight.platformWidth = 4.0;

    var jovian = new AnimatedGameObject2D(jovianMesh, {spriteDimensions: {x: 10, y: 14}});
    var jovPos = new Vec3(position.x + (Math.random() * 4) - 2, position.y + Math.random() * 4 + 2, position.z);
    jovian.physics.position.set(jovPos);
    // jovian.physics.velocity.set(1, 0, 0);
    jovian.scale.set(0.5, 0.5, 0.5);
    jovian.opts.animationRate = 0.15;
    jovian.opts.limitDimensions = {x: 10, y: 1};
    jovian.physics.opts.dragEnabled = false;
    jovian.bounds = {
      radius: 0.5
    };
    jovian.supplementalMove = function(jov, dt) {
      if(jov.onPlatform) {
        var platformRight = jov.onPlatform.centerOfPlatform.x + jov.onPlatform.platformWidth / 2;
        var platformLeft = jov.onPlatform.centerOfPlatform.x - jov.onPlatform.platformWidth / 2;

        if(jov.position.x > platformRight || jov.position.x < platformLeft) {
          jov.textureFlip = !jov.textureFlip;
          jov.physics.velocity.mul(-1, 1, 1);
        }
      }
    };
    jovian.isJovian = true;

    scene.gameObjects.push(platformCL);
    scene.gameObjects.push(platformCR);
    scene.gameObjects.push(platformEndRight);
    scene.gameObjects.push(platformEndLeft);
    scene.gameObjects.push(jovian);
  };
};

