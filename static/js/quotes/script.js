var camera, scene, renderer;
var params = {
  clipIntersection: true,
  planeConstant: 0,
  showHelpers: false
};
var clipPlanes = [
  new THREE.Plane(new THREE.Vector3(1, 0, 0), 0),
  new THREE.Plane(new THREE.Vector3(0, -1, 0), 0),
  new THREE.Plane(new THREE.Vector3(0, 0, -1), 0)
];



$(document).ready(function() {
  init();
  let data = getSentimentData();
  visualizeDataSpheres(data);
  setupHelpers();
  setupHelpers();
  window.addEventListener('resize', onWindowResize, false);
  render();
});


function getSentimentData() {
  let sentimentData = $('#data').data('sentiment');
  let data = JSON.parse(JSON.stringify(sentimentData));
  console.log(data);
  return data;
}


function visualizeDataSpheres(data) {
	var group = new THREE.Group();
  for (i in data) {
    let value = data[i];
    let mesh = meshForTextPolarity(value.text, value.polarity, value.polarity_confidence, value.subjectivity, value.subjectivity_confidence);
    group.add(mesh);
  }
  scene.add(group);
}

function meshForTextPolarity(text, polarity, polarity_confidence, subjectivity, subjectivity_confidence) {
	let polarity_factor = (polarity === 'negative') ? 0.75 : 1.25;
	let radius = polarity_confidence*polarity_factor* 10;
  let geometry = new THREE.SphereBufferGeometry(radius, 48, 24);
  let material = new THREE.MeshLambertMaterial({
    color: new THREE.Color(Math.sin(i * polarity_confidence) * 0.5 + 0.5, Math.cos(i * polarity_confidence) * 0.5 + 0.5, Math.sin(i * polarity_confidence * subjectivity) * 0.5 + 0.5),
    side: THREE.DoubleSide,
    clippingPlanes: clipPlanes,
    clipIntersection: params.clipIntersection
  });
  return new THREE.Mesh(geometry, material);
}

function init() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.localClippingEnabled = true;
  document.body.appendChild(renderer.domElement);
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 200);
  camera.position.set(-20, 30, 40);
  var controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', render); // use only if there is no animation loop
  controls.minDistance = 10;
  controls.maxDistance = 100;
  controls.enablePan = false;
  var light = new THREE.HemisphereLight(0xffffff, 0x080808, 1);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0x505050));
}

// function setupSphere() {
//   var group = new THREE.Group();
//   for (var i = 1; i < 25; i++) {
//     var geometry = new THREE.SphereBufferGeometry(i / 2, 48, 24);
//     var material = new THREE.MeshLambertMaterial({
//       color: new THREE.Color(Math.sin(i * 0.5) * 0.5 + 0.5, Math.cos(i * 1.5) * 0.5 + 0.5, Math.sin(i * 4.5 + 0) * 0.5 + 0.5),
//       side: THREE.DoubleSide,
//       clippingPlanes: clipPlanes,
//       clipIntersection: params.clipIntersection
//     });
//     group.add(new THREE.Mesh(geometry, material));
//   }
//   scene.add(group);
// }

function setupHelpers() {
  // helpers
  var helpers = new THREE.Group();
  helpers.add(new THREE.AxesHelper(20));
  helpers.add(new THREE.PlaneHelper(clipPlanes[0], 30, 0xff0000));
  helpers.add(new THREE.PlaneHelper(clipPlanes[1], 30, 0x00ff00));
  helpers.add(new THREE.PlaneHelper(clipPlanes[2], 30, 0x0000ff));
  helpers.visible = false;
  scene.add(helpers);
}

function setupGUI() {
  // gui
  var gui = new dat.GUI();
  gui.add(params, 'clipIntersection').name('clip intersection').onChange(function(value) {
    var children = group.children;
    for (var i = 0; i < children.length; i++) {
      children[i].material.clipIntersection = value;
    }
    render();
  });
  gui.add(params, 'planeConstant', -16, 16).step(1).name('plane constant').onChange(function(value) {
    for (var j = 0; j < clipPlanes.length; j++) {
      clipPlanes[j].constant = value;
    }
    render();
  });
  gui.add(params, 'showHelpers').name('show helpers').onChange(function(value) {
    helpers.visible = value;
    render();
  });
  //
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

function render() {
  renderer.render(scene, camera);
}