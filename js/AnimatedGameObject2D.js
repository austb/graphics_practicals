var AnimatedGameObject2D = (function() {
  var ANIM_RATE = 0.05;

  var mergeDefaults = function(obj) {
    var defaults = {
      rotationConst: 1.0,
      spriteOffset: {x: 0, y: 0},
      spriteDimensions: {x: 8, y: 1},
      display: true,
    };

    for(var attr in obj) {
      if(!defaults[attr]) {
        console.warn("The attribute: " + attr + " is not used by AnimatedGameObject2D");
      }

      defaults[attr] = obj[attr];
    }

    return defaults;
  };

  var AnimatedGameObject2D = function(mesh, opts) {
    GameObject2D.call(this, mesh);

    opts = opts || {};
    if(!opts.spriteDimensions) {
      console.warn("No spriteDimensions provided (should you use GameObject2D instead?)");
    }

    this.opts = mergeDefaults(opts);

    this.physics = new PhysicsObject(this);

    this.timeSinceLastSpriteChange = 0;

    this.setTextureMat4();
  };

  AnimatedGameObject2D.prototype = Object.create(GameObject2D.prototype);

  AnimatedGameObject2D.prototype.disableAllEnvironmentForces = function() {
    this.physics.disableAllEnvironmentForces();
  };
  AnimatedGameObject2D.prototype.resetPosition = function() {
    this.position = new Vec3(0, 0, 0);
    this.orientation = 0;
  };

  AnimatedGameObject2D.prototype.changeSprite = function() {
    this.opts.spriteOffset.x += 1;

    if(this.opts.spriteOffset.x == this.opts.spriteDimensions.x) {
      this.opts.spriteOffset.x = 0;
      this.opts.spriteOffset.y = (this.opts.spriteOffset.y + 1) % this.opts.spriteDimensions.y;
    }

    this.timeSinceLastSpriteChange = 0;
    this.setTextureMat4();
  };

  AnimatedGameObject2D.prototype.move = function(dt) {
    this.timeSinceLastSpriteChange += dt;

    if(this.timeSinceLastSpriteChange >= ANIM_RATE) {
      this.changeSprite();
    }

    this.physics.move(dt);

  };

  AnimatedGameObject2D.prototype.setTextureMat4 = function() {
    var samplerMat = new Mat4().scale({x: this.opts.spriteDimensions.x, y: this.opts.spriteDimensions.y, z: 1.0}).
      translate(this.opts.spriteOffset);
    samplerMat.invert();
    Material.shared.textureProjMatrix.set(samplerMat);
  };

  AnimatedGameObject2D.prototype.shouldDisplayObject = function() {
    return this.opts.display;
  };

  return AnimatedGameObject2D;
})();

