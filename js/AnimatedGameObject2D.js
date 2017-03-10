var AnimatedGameObject2D = (function() {
  var ANIM_RATE = 0.10;
  var config = {
    scale: {x: -0.25, y: 0.25, z: 0.25},
    isMoving: false,
    movementVec : new Vec3(0.5, 0.0, 0.0),
    isRotating: false,
    rotationConst: 1.0,
    spriteOffset: {x: 0, y: 0},
    spriteDimensions: {x: 8, y: 1}
  };

  var mergeDefaults = function(obj) {
    for(var attr in obj) {
      if(!config[attr]) {
        console.warn("The attribute: " + attr + " is not used by AnimatedGameObject2D");
      }

      config[attr] = obj[attr];
    }
  };

  var AnimatedGameObject2D = function(mesh, opts) {
    GameObject2D.call(this, mesh);

    opts = opts || {};
    if(!opts.spriteDimensions) {
      console.warn("No spriteDimensions provided (should you use GameObject2D instead?)");
    }

    mergeDefaults(opts);
    this.scale = config.scale;

    this.timeSinceLastSpriteChange = 0;

    this.setTextureMat4();
  };

  AnimatedGameObject2D.prototype = Object.create(GameObject2D.prototype);

  AnimatedGameObject2D.prototype.resetPosition = function() {
    this.position = new Vec3(0, 0, 0);
    this.orientation = 0;
  };

  AnimatedGameObject2D.prototype.toggleMovement = function() {
    config.isMoving = !config.isMoving;
  };

  AnimatedGameObject2D.prototype.toggleRotation = function() {
    config.isRotating = !config.isRotating;
  };

  AnimatedGameObject2D.prototype.move = function(dt) {
    if(config.isMoving) {
      this.position.addScaled(dt, config.movementVec);
    }

    if(config.isRotating) {
      this.orientation += config.rotationConst * dt;
    }

    this.timeSinceLastSpriteChange += dt;

    if(this.timeSinceLastSpriteChange >= ANIM_RATE) {
      config.spriteOffset.x += 1;

      if(config.spriteOffset.x == config.spriteDimensions.x) {
        config.spriteOffset.x %= config.spriteDimensions.x;
        config.spriteOffset.y = (config.spriteOffset.y + 1) % config.spriteOffset.y;
      }

      this.timeSinceLastSpriteChange = 0;
      this.setTextureMat4();
    }

  };

  AnimatedGameObject2D.prototype.setTextureMat4 = function() {
    var samplerMat = new Mat4().scale({x: config.spriteDimensions.x, y: config.spriteDimensions.y, z: 1.0}).
      translate(config.spriteOffset);
    samplerMat.invert();
    Material.shared.textureProjMatrix.set(samplerMat);
  };

  return AnimatedGameObject2D;
})();

