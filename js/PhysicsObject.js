var PhysicsObject = (function() {

  var MASS = 1.0;
  var VELOCITY = new Vec3(0.0, 0.0, 0.0);
  var POSITION = new Vec3(0.0, 0.0, 0.0);

  var mergeDefaults = function(obj) {
    var defaults = {
      affectedByGravity: true,
      dragEnabled: true,
      dragFactor: 1.0
    };

    for(var attr in obj) {
      defaults[attr] = obj[attr];
    }

    return defaults;
  };

  var PhysicsObject = function(gameObject, values, opts) {
    values = values || {};
    opts = opts || {};
    this.opts = mergeDefaults(opts);

    this.gameObject = gameObject;

    this.position = values.position || new Vec3(POSITION);
    this.velocity = values.velocity || new Vec3(VELOCITY);
    this.mass = values.mass || MASS;

    this.comForceThisFrame = new Vec3(0.0, 0.0, 0.0);
  };

  PhysicsObject.prototype.applyCenterOfMassForce = function(vec3) {
    this.comForceThisFrame.add(vec3);
  };

  PhysicsObject.prototype.dragForce = function() {
    if(this.opts.dragEnabled) {
      this.applyCenterOfMassForce(this.velocity.times(-1 * this.opts.dragFactor));
    }
  };

  PhysicsObject.prototype.centerOfMassMotion = function(dt) {
    this.dragForce();

    // Apply center of mass force to velocity
    this.velocity.addScaled(dt, this.comForceThisFrame.div(this.mass));

    // Apply velocity to change position
    this.position.addScaled(dt, this.velocity);
  };

  PhysicsObject.prototype.move = function(dt) {
    this.centerOfMassMotion(dt);

    this.apply();
    this.comForceThisFrame.set(0.0, 0.0, 0.0);
  };

  PhysicsObject.prototype.apply = function() {
    // Update the game object properties for drawing
    this.gameObject.position.set(this.position);
  };


  return PhysicsObject;
})();

