var AnimatedGameObject2D = (function() {
  var ANIM_RATE = 0.10;

  var mergeDefaults = function(obj) {
    var defaults = {
      scale: {x: -0.25, y: 0.25, z: 0.25},
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

    this.config = mergeDefaults(opts);
    this.scale = this.config.scale;

    this.physicsObject = new PhysicsObject(this);

    this.timeSinceLastSpriteChange = 0;

    this.setTextureMat4();
  };

  AnimatedGameObject2D.prototype = Object.create(GameObject2D.prototype);

  AnimatedGameObject2D.prototype.resetPosition = function() {
    this.position = new Vec3(0, 0, 0);
    this.orientation = 0;
  };

  AnimatedGameObject2D.prototype.toggleMovement = function() {
    this.config.isMoving = !this.config.isMoving;
  };

  AnimatedGameObject2D.prototype.toggleRotation = function() {
    this.config.isRotating = !this.config.isRotating;
  };

  AnimatedGameObject2D.prototype.changeSprite = function() {
    this.config.spriteOffset.x += 1;

    if(this.config.spriteOffset.x == this.config.spriteDimensions.x) {
      this.config.spriteOffset.x %= this.config.spriteDimensions.x;
      this.config.spriteOffset.y = (this.config.spriteOffset.y + 1) % this.config.spriteOffset.y;
    }

    this.timeSinceLastSpriteChange = 0;
    this.setTextureMat4();
  };

  AnimatedGameObject2D.prototype.move = function(dt) {
    this.timeSinceLastSpriteChange += dt;

    if(this.timeSinceLastSpriteChange >= ANIM_RATE) {
      this.changeSprite();
    }

    this.physicsObject.move(dt);
  };

  AnimatedGameObject2D.prototype.setTextureMat4 = function() {
    var samplerMat = new Mat4().scale({x: this.config.spriteDimensions.x, y: this.config.spriteDimensions.y, z: 1.0}).
      translate(this.config.spriteOffset);
    samplerMat.invert();
    Material.shared.textureProjMatrix.set(samplerMat);
  };

  return AnimatedGameObject2D;
})();

