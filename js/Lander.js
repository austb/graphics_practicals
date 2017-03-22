var landerExplosion = function(scene, lander, mesh) {
  return function() {
    if(lander.opts.display) {
      var explosion = new AnimatedGameObject2D(mesh, {spriteDimensions: {x: 6, y: 6}});
      explosion.disableAllEnvironmentForces();
      explosion.opts.animationRate = 0.05;

      scene.explosion = explosion;

      lander.scheduleRemoval();

      explosion.physics.position.set(lander.position);
      explosion.scheduleRemoval(1700);

      scene.gameObjects.push(explosion);
    }
  };
};

var platformCollisionWithLanderAction = function(platform, lander) {
  // Land if above and upright
  var standardAngle =  (Math.abs(lander.orientation) % (2 * Math.PI));
  var objPos = lander.position;
  if(lander.parent) {
    objPos.add(lander.parent.pos);
  }

  if(!lander.boooooom || (objPos.y > platform.position.y
      && (standardAngle < (Math.PI / 6)
          || Math.abs(standardAngle - (2* Math.PI)) < (Math.PI / 6))
      && lander.physics.velocity.length() < 4.0)) {

    lander.physics.velocity.y = 0;
    lander.physics.applyCenterOfMassForce(new Vec3(0, lander.physics.mass * 9.8, 0));

    if(lander.activateShield) {
      lander.activateShield();
    } else {
      lander.onPlatform = platform;

      if(lander.physics.velocity.x === 0.0) {
        lander.physics.velocity.set(1, 0, 0);
      }
    }

    return;
  }

  lander.boooooom();
};

var diamondsCollisionWithLanderAction = function(diamond, lander) {
  if(!lander.shield.shouldDisplay()) {
    diamond.scheduleRemoval();
    lander.diamonds++;
  }
};

var collidesWithLanderFn = function(obj, collisionAction) {
  obj.collidesWithLander = function(lander) {
    var objPos = obj.position;

    if(obj.parent) {
      objPos.add(obj.parent.position);
    }

    var dist = lander.position.minus(objPos).length();
    var radiusSums = lander.bounds.radius + obj.bounds.radius;

    if(dist < radiusSums && obj.shouldDisplay()) {
      obj.collisionWithLanderAction(obj, lander);
    }
  };

  obj.collisionWithLanderAction = collisionAction;
};

var rectangleCollidesWithLanderFn = function(obj, collisionAction) {
  var width = 1;
  var height = 1;
  obj.collidesWithLander = function(lander) {
    var objPos = lander.position;
    if(lander.parent) {
      objPos.add(lander.parent.position);
    }

    // Check if we're above/below
    if(lander.position.x > (obj.position.x - width - lander.bounds.radius) &&
       lander.position.x < (obj.position.x + width + lander.bounds.radius)) {

      // Then check to see if we hit it
      if(lander.position.y < (obj.position.y + height + lander.bounds.radius) &&
         lander.position.y > (obj.position.y - height - lander.bounds.radius)) {

        obj.collisionWithLanderAction(obj, lander);
      }
    }
  };

  obj.collisionWithLanderAction = collisionAction;
};

var landerActions = function(lander, keysPressed) {

  var latAccel = 30.0 * lander.physics.mass;
  if(keysPressed.D) {
    lander.physics.applyForce(
      new Vec3(latAccel * Math.cos(lander.orientation),
                 latAccel * Math.sin(lander.orientation),
                 0.0),
      new Vec3(0.5 * Math.sin(-lander.orientation), 0.5 * Math.cos(lander.orientation), 0.0));

    lander.disableShield();
  }

  if(keysPressed.W) {
    var accel = 30.0 * lander.physics.mass;
    lander.physics.applyCenterOfMassForce(
       new Vec3(accel * Math.sin(-lander.orientation),
                accel * Math.cos(lander.orientation),
                0.0));

    lander.disableShield();
  }

  if(keysPressed.A) {
    latAccel *= -1;
    lander.physics.applyForce(
      new Vec3(latAccel * Math.cos(lander.orientation),
               latAccel * Math.sin(lander.orientation),
               0.0),
      new Vec3(0.5 * Math.sin(-lander.orientation), 0.5 * Math.cos(lander.orientation), 0.0));

    lander.disableShield();
  }

};

var afterBurnerActions = function(key) {
  var plasmaCreationRate = 0.002;
  return function(burner, keysPressed, dt, scene) {
    if(keysPressed[key]) {
      burner.opts.display = true;

      // var numberOfPlasmas = Math.floor(dt / plasmaCreationRate);
      numberOfPlasmas = 1;
      for(var i = 0; i < numberOfPlasmas; i++) {
        scene.newPlasma(this);
      }
    } else {
      burner.opts.display = false;
    }
  };
};

var plasmaLifetime = 300;
var plasmaFadeOutFunction = function(plasma, dt) {
  plasma.opts.transparency -= (dt / (plasmaLifetime / 1000));
};

var newPlasmaExhaustFn = function(scene, mesh) {
  return function(burner) {
    var newObj = new AnimatedGameObject2D(mesh, {spriteDimensions: {x: 1, y: 1}});
    newObj.physics.opts.affectedByGravity = false;

    var theta = scene.lander.orientation;
    var x = burner.position.x;
    var y = burner.position.y;
    var rotatedX = (Math.cos(theta) * x) - (Math.sin(theta) * y);
    var rotatedY = (Math.sin(theta) * x) + (Math.cos(theta) * y);
    newObj.physics.position.set(scene.lander.position.plus(rotatedX, rotatedY, 0.0));
    newObj.physics.velocity.set(Math.random() * 2 - 1, 2 * Math.random() - 1, 0.0);
    newObj.scale.set(0.060, 0.060, 0.060);
    newObj.removeAtTime = scene.timeAtLastFrame + plasmaLifetime;
    newObj.supplementalMove = plasmaFadeOutFunction;

    scene.gameObjects.push(newObj);
  };
};
