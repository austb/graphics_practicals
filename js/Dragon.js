var Dragon = (function() {
  var ANIM_RATE = 0.10;

  var Dragon = function(mesh) {
    GameObject2D.call(this, mesh);

    this.scale = {x:-0.25, y:0.25, z:0.25};

    this.isMoving = false;
    this.isSpinning = false;
    this.timeSinceLastSpriteChange = 0;
    this.spriteOffset = {x: 0, y: 0, z: 0};

    this.setTextureMat4();
  };

  Dragon.prototype = Object.create(GameObject2D.prototype);

  Dragon.prototype.resetPosition = function() {
    this.position = new Vec3(0, 0, 0);
    this.orientation = 0;
  };

  Dragon.prototype.move = function(dt) {
    if(this.isMoving) {
      this.position.add(0.5 * dt, 0, 0);
    }

    if(this.isSpinning) {
      this.orientation += 1.0 * dt;
    }

    this.timeSinceLastSpriteChange += dt;

    if(this.timeSinceLastSpriteChange >= ANIM_RATE) {
      this.spriteOffset.x += 1;
      this.spriteOffset.x %= 8;
      this.timeSinceLastSpriteChange = 0;

      this.setTextureMat4();
    }

  };

  Dragon.prototype.setTextureMat4 = function() {
    var scale = {x: 8, y: 1, z: 1};
    var samplerMat = new Mat4().scale(scale).translate(this.spriteOffset);
    samplerMat.invert();
    Material.shared.textureProjMatrix.set(samplerMat);
  };

  return Dragon;
})();

