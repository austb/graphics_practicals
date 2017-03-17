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
  return function(burner, keysPressed) {
    if(keysPressed[key]) {
      burner.opts.display = true;
    } else {
      burner.opts.display = false;
    }
  };
};
