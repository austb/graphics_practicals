var app;
var overlay;

// App constructor
var App = function(canvas) {

  // set a pointer to our canvas
  this.canvas = canvas;

  // if no GL support, cry
  this.gl = canvas.getContext("experimental-webgl");
  if (this.gl === null) {
    alert( ">>> Browser does not support WebGL <<<" );
    return;
  }

  this.gl.pendingResources = {};

  // set the initial canvas size and viewport
  this.canvas.width = this.canvas.clientWidth;
  this.canvas.height = this.canvas.clientHeight;
  this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

  // create a simple scene
  this.scene = new Scene(this.gl);
  this.keysPressed = {};

  var scene = this.scene;

  document.onkeydown = function(event) {
    app.keysPressed[keyboardMap[event.keyCode]] = true;
  };

  document.onkeyup = function(event) {
    app.keysPressed[keyboardMap[event.keyCode]] = false;
  };

};

// animation frame update
App.prototype.update = function() {

  var pendingResourceNames = Object.keys(this.gl.pendingResources);
  if(pendingResourceNames.length === 0) {
    // animate and draw scene
    this.scene.update(this.gl, this.keysPressed);
    overlay.innerHTML = "Ready.";
  } else {
    overlay.innerHTML = "Loading: " + pendingResourceNames;
  }

  // refresh
  window.requestAnimationFrame(function() {
    app.update();
  });
};

App.prototype.updateAspectRatio = function() {
  this.canvas.width = this.canvas.clientWidth;
  this.canvas.height = this.canvas.clientHeight;
  this.gl.viewport(0, 0,
    this.canvas.width, this.canvas.height);

  var width = this.canvas.width / 5;
  var height = this.canvas.height / 5;
  this.scene.miniMapViewport = [ 4 * width, 0, width, height];

  this.scene.diamondScoreViewport = [this.canvas.width - 60, this.canvas.height - 40, 30, 30];

  this.scene.camera.setAspectRatio(
    this.canvas.clientWidth /
    this.canvas.clientHeight );

};

// entry point from HTML
window.addEventListener('load', function() {

  var canvas = document.getElementById("canvas");
  overlay = document.getElementById("overlay");
  overlay.innerHTML = "WebGL";

  app = new App(canvas);
  app.updateAspectRatio();

  window.requestAnimationFrame(function() {
    app.update();
  });

  window.addEventListener('resize', function() {
    app.updateAspectRatio();
  });

});
