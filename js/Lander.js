var landerActions = function(lander, keysPressed) {

  var latAccel = 30.0 * lander.physics.mass;
  if(keysPressed.D) {
    lander.physics.applyForce(
      new Vec3(latAccel * Math.cos(lander.orientation),
                 latAccel * Math.sin(lander.orientation),
                 0.0),
      new Vec3(0.5 * Math.sin(-lander.orientation), 0.5 * Math.cos(lander.orientation), 0.0));
  }

  if(keysPressed.W) {
    var accel = 30.0 * lander.physics.mass;
    lander.physics.applyCenterOfMassForce(
       new Vec3(accel * Math.sin(-lander.orientation),
                accel * Math.cos(lander.orientation),
                0.0));
  }

  if(keysPressed.A) {
    latAccel *= -1;
    lander.physics.applyForce(
      new Vec3(latAccel * Math.cos(lander.orientation),
               latAccel * Math.sin(lander.orientation),
               0.0),
      new Vec3(0.5 * Math.sin(-lander.orientation), 0.5 * Math.cos(lander.orientation), 0.0));
  }
};

var afterBurnerActions = function(key) {
  var plasmaCreationRate = 0.005;
  return function(burner, keysPressed, dt, scene) {
    if(keysPressed[key]) {
      burner.opts.display = true;

      var numberOfPlasmas = Math.floor(dt / plasmaCreationRate);
      console.log(numberOfPlasmas);
      for(var i = 0; i < numberOfPlasmas; i++) {
        scene.newPlasma(this);
      }
    } else {
      burner.opts.display = false;
    }
  };
};

var newPlasmaExhaustFn = function(scene, mesh) {
  var plasmaId = 0;
  return function(burner) {
    var newObj = new AnimatedGameObject2D(mesh, {spriteDimensions: {x: 1, y: 1}});
    newObj.physics.opts.affectedByGravity = false;

    var theta = scene.lander.orientation;
    var x = burner.position.x;
    var y = burner.position.y;
    var rotatedX = (Math.cos(theta) * x) - (Math.sin(theta) * y);
    var rotatedY = (Math.sin(theta) * x) + (Math.cos(theta) * y);
    newObj.physics.position.set(scene.lander.position.plus(rotatedX, rotatedY, 0.0));
    newObj.physics.velocity.set(Math.random() * 2, 2 * Math.random(), 0.0);
    newObj.scale.set(0.10, 0.10, 0.10);

    newObj.plasmaId = plasmaId;
    plasmaId++;

    scene.gameObjects.push(newObj);

    setTimeout(
      function(){
        for(var i = scene.gameObjects.length - 1; i >= 0; i--) {
          if(scene.gameObjects[i] === newObj) {
            scene.gameObjects.splice(i, 1);
            break;
          }
        }
      }, 300);
  };
};
