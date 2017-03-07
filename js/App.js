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

  var scene = this.scene;

  document.onkeypress = function(event) {
    switch(event.key) {
      case 'w':
        scene.moveSelected(1, 0);
        break;
      case 'a':
        scene.moveSelected(0, -1);
        break;
      case 's':
        scene.moveSelected(-1, 0);
        break;
      case 'd':
        scene.moveSelected(0, 1);
        break;
      case 'h':
        scene.addWallAtSelected();
        break;
      case 'j':
        scene.moveStartToSelected();
        break;
      case 'k':
        scene.moveEndToSelected();
        break;
    }
  };

};

// animation frame update
App.prototype.update = function() {

  var pendingResourceNames = Object.keys(this.gl.pendingResources);
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

// Warn if overriding existing method
if(Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        } 
    }
    return true;
};
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});
