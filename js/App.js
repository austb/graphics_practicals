var app;
var overlay;
var pendingResources = {};

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

	// set the initial canvas size and viewport
	this.canvas.width = this.canvas.clientWidth;
	this.canvas.height = this.canvas.clientHeight;
	this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

	// create a simple scene
	this.scene = new Scene(this.gl);

  var scene = this.scene;

  document.onkeypress = function(event) {
    switch(event.key) {
      case 's':
        scene.toggleAnimation();
        break;
      case 'r':
        scene.resetPosition();
        break;
      default:
        alert("Press s to toggle the animation\nPress r to reset to triangle's position");
        break;
    }
  };

};

// animation frame update
App.prototype.update = function() {

	var pendingResourceNames = Object.keys(pendingResources);
	if(pendingResourceNames.length === 0) {
		// animate and draw scene
		this.scene.update(this.gl);
		overlay.innerHTML = "Ready.";
	} else {
		overlay.innerHTML = "Loading: " + pendingResourceNames;
	}

	// refresh
	window.requestAnimationFrame(function() {
		app.update();
	});
};

// entry point from HTML
window.addEventListener('load', function() {

	var canvas = document.getElementById("canvas");
	overlay = document.getElementById("overlay");
	overlay.innerHTML = "WebGL";

	app = new App(canvas);

	window.requestAnimationFrame(function() {
		app.update();
	});

});
