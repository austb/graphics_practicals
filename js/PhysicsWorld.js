var PhysicsWorld = (function() {

  var GRAVITY = new Vec3(0.0, -9.8, 0.0);

  var mergeDefaults = function(obj) {
    var defaults = {
      gravityEnabled: true,
    };

    for(var attr in obj) {
      defaults[attr] = obj[attr];
    }

    return defaults;
  };

  var PhysicsWorld = function(scene, values, opts) {
    values = values || {};
    opts = opts || {};
    this.opts = mergeDefaults(opts);

    this.scene = scene;

    this.gameObjects = scene.gameObjects;

    this.gravity = values.gravity || new Vec3(GRAVITY);
  };

  PhysicsWorld.prototype.initialize = function(dt) {
    for(var i = 0; i < this.gameObjects.length; i++) {
      this.gameObjects[i].physics.apply();
    }
  };

  PhysicsWorld.prototype.update = function(dt) {
    for(var i = 0; i < this.gameObjects.length; i++) {
      var obj = this.gameObjects[i];

      if(this.opts.gravityEnabled && obj.physics.opts.affectedByGravity) {
          var force = this.gravity.times(obj.physics.mass);
          obj.physics.applyCenterOfMassForce(force);
      }

      if(obj.collidesWithLander) {
        obj.collidesWithLander(this.scene.lander);
      }
    }
  };

  return PhysicsWorld;
})();

