var AnimatedGameObject2D = (function() {
  var ANIM_RATE = 0.10;

  var mergeDefaults = function(obj) {
    var defaults = {
      scale: {x: -1.0, y: 1.0, z: 1.0},
      isMoving: false,
      movementVec : new Vec3(0.5, 0.0, 0.0),
      isRotating: false,
      rotationConst: 1.0,
      spriteOffset: {x: 0, y: 0},
      spriteDimensions: {x: 8, y: 1}
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
    this.scale = this.opts.scale;

    this.physics = new PhysicsObject(this);

    this.timeSinceLastSpriteChange = 0;

    this.setTextureMat4();
  };

  AnimatedGameObject2D.prototype = Object.create(GameObject2D.prototype);

  AnimatedGameObject2D.prototype.resetPosition = function() {
    this.position = new Vec3(0, 0, 0);
    this.orientation = 0;
  };

  AnimatedGameObject2D.prototype.toggleMovement = function() {
    this.opts.isMoving = !this.opts.isMoving;
  };

  AnimatedGameObject2D.prototype.toggleRotation = function() {
    this.opts.isRotating = !this.opts.isRotating;
  };

  AnimatedGameObject2D.prototype.changeSprite = function() {
    this.opts.spriteOffset.x += 1;

    if(this.opts.spriteOffset.x == this.opts.spriteDimensions.x) {
      this.opts.spriteOffset.x %= this.opts.spriteDimensions.x;
      this.opts.spriteOffset.y = (this.opts.spriteOffset.y + 1) % this.opts.spriteOffset.y;
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

    this.updateModelTransformation();
  };

  AnimatedGameObject2D.prototype.setTextureMat4 = function() {
    var samplerMat = new Mat4().scale({x: this.opts.spriteDimensions.x, y: this.opts.spriteDimensions.y, z: 1.0}).
      translate(this.opts.spriteOffset);
    samplerMat.invert();
    Material.shared.textureProjMatrix.set(samplerMat);
  };

  return AnimatedGameObject2D;
})();

