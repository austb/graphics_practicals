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

  var PhysicsWorld = function(gameObjects, values, opts) {
    values = values || {};
    opts = opts || {};
    this.opts = mergeDefaults(opts);

    this.gameObjects = gameObjects;

    this.gravity = values.gravity || new Vec3(GRAVITY);
  };

  PhysicsWorld.prototype.update = function(dt) {
    if(this.opts.gravityEnabled) {
      for(var i = 0; i < this.gameObjects.length; i++) {
        var obj = this.gameObjects[i].physics;

        if(obj.opts.affectedByGravity) {
          var force = this.gravity.times(obj.mass);
          obj.applyCenterOfMassForce(force);
        }
      }
    }
  };

  return PhysicsWorld;
})();

