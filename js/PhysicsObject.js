var PhysicsObject = (function() {

  var MASS = 100.0;
  var VELOCITY = new Vec3(0.0, 0.0, 0.0);
  var POSITION = new Vec3(0.0, 0.0, 0.0);
  var ORIENTATION = 0.0;
  var ANGULAR_VELOCITY = new Vec3(0.0, 0.0, 0.0);
  var RADIUS = 3.0;

  var mergeDefaults = function(obj) {
    var defaults = {
      affectedByGravity: true,
      dragEnabled: true,
      dragFactor: 2.0,
      angularMass: 0.5,
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

    this.orientation = values.orientation || ORIENTATION;
    this.angularVelocity = values.angularVelocity || new Vec3(ANGULAR_VELOCITY);
    this.radius = values.radius || RADIUS;

    this.comForceThisFrame = new Vec3(0.0, 0.0, 0.0);
    this.torqueForceThisFrame = new Vec3(0.0, 0.0, 0.0);
  };

  PhysicsObject.prototype.disableAllEnvironmentForces = function() {
    this.opts.affectedByGravity = false;
    this.opts.dragEnabled = false;
  };

  PhysicsObject.prototype.applyCenterOfMassForce = function(force) {
    this.comForceThisFrame.add(force);
  };

  PhysicsObject.prototype.applyTorque = function(force, r) {
    var torque = r.cross(force);

    this.torqueForceThisFrame.add(torque);
  };

  PhysicsObject.prototype.applyForce = function(force, r) {
    var distance = r.length();
    var frac = distance / this.radius;

    var comForce = force.times(1 - frac);
    var forceApplyingTorque = force.times(frac);

    this.applyCenterOfMassForce(comForce);
    this.applyTorque(forceApplyingTorque, r);
  };

  PhysicsObject.prototype.dragForce = function() {
    if(this.opts.dragEnabled) {
      this.applyCenterOfMassForce(this.velocity.times(-1 * this.mass * this.opts.dragFactor));
      this.applyTorque(new Vec3(this.opts.dragFactor * this.angularVelocity.z * this.mass, 0.0, 0.0), new Vec3(0.0, 0.5, 0.0));
    }
  };

  PhysicsObject.prototype.centerOfMassMotion = function(dt) {
    this.dragForce();

    // Apply center of mass force to velocity
    this.velocity.addScaled(dt, this.comForceThisFrame.div(this.mass));

    // Apply velocity to change position
    this.position.addScaled(dt, this.velocity);
  };

  PhysicsObject.prototype.torqueMotion = function(dt) {
    this.angularVelocity.addScaled(dt, this.torqueForceThisFrame.div(this.opts.angularMass * this.mass));

    this.orientation += this.angularVelocity.z * dt;
  };

  PhysicsObject.prototype.resetFrameForces = function() {
    this.comForceThisFrame.set(0.0, 0.0, 0.0);
    this.torqueForceThisFrame.set(0.0, 0.0, 0.0);
  };

  PhysicsObject.prototype.move = function(dt) {
    this.centerOfMassMotion(dt);

    this.torqueMotion(dt);

    this.apply();

    this.resetFrameForces();
  };

  PhysicsObject.prototype.apply = function() {
    // Update the game object properties for drawing
    this.gameObject.position.set(this.position);
    this.gameObject.orientation = this.orientation;
  };


  return PhysicsObject;
})();

