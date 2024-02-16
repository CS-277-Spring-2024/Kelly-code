import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';

// textures
const textureLoader = new THREE.TextureLoader(); 

// ground texture
const metalTexture = textureLoader.load
  ('/assets/textures/engraved/Engraved_Metal_003_ROUGH.jpg') // make sure this file exists!
metalTexture.wrapS = THREE.RepeatWrapping; // horizontal wrapping
metalTexture.wrapT = THREE.RepeatWrapping; // vertical wrapping
metalTexture.repeat.set( 4, 4 ); // how many times to repeat

// wood table texture
const tableTexture = textureLoader.load
  ('/assets/textures/wood/abstract-antique-backdrop-164005.jpg')
  
// wall texture
const wallTexture = textureLoader.load
  ('/assets/textures/red-bricks/red_bricks_04_diff_1k.jpg')
wallTexture.wrapS = THREE.RepeatWrapping; // horizontal wrapping
wallTexture.wrapT = THREE.RepeatWrapping; // vertical wrapping
wallTexture.repeat.set( 4, 4 ); // how many times to repeat
  


const exrLoader = new EXRLoader()

const bumpMap = new THREE.TextureLoader().load(
  '/assets/textures/engraved/Engraved_Metal_003_ROUGH.jpg',
  (metalTexture) => {
    metalTexture.wrapS = THREE.RepeatWrapping; // horizontal wrapping
    metalTexture.wrapT = THREE.RepeatWrapping; // vertical wrapping
    metalTexture.repeat.set( 4, 4 ); // how many times to repeat
    metalTexture.side = THREE.DoubleSide;
  }
)


const wallBumpMap = new THREE.TextureLoader().load(
  '/assets/textures/red-bricks/red_bricks_04_rough_1k.jpg',
  (wallTexture) => {
    wallTexture.wrapS = THREE.RepeatWrapping; // horizontal wrapping
    wallTexture.wrapT = THREE.RepeatWrapping; // vertical wrapping
    wallTexture.repeat.set( 4, 4 ); // how many times to repeat
    wallTexture.side = THREE.DoubleSide;
  }
)


const metalMaterial = new THREE.MeshPhongMaterial({ color:0x808080 })
metalMaterial.map = metalTexture
metalMaterial.bumpMap = bumpMap

const wallMaterial = new THREE.MeshPhongMaterial({ color:0x808080 })
wallMaterial.map = wallTexture
wallMaterial.bumpMap = wallBumpMap

// basic scene setup
const scene = new THREE.Scene();
scene.backgroundColor = 0xffffff;

// setup camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
);
camera.position.x = -3;
camera.position.z = 8;
camera.position.y = 2;

// setup the renderer and attach to canvas
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff);
document.body.appendChild(renderer.domElement);

// add lights
scene.add(new THREE.AmbientLight(0xAAAAAA));

const dirLight = new THREE.DirectionalLight(0xaaaaaa);
dirLight.position.set(5, 12, 8);
dirLight.castShadow = true;
dirLight.intensity = 1;
dirLight.shadow.camera.near = 0.1;
dirLight.shadow.camera.far = 200;
dirLight.shadow.camera.right = 10;
dirLight.shadow.camera.left = -10;
dirLight.shadow.camera.top = 10;
dirLight.shadow.camera.bottom = -10;
dirLight.shadow.mapSize.width = 512;
dirLight.shadow.mapSize.height = 512;
dirLight.shadow.radius = 4;
dirLight.shadow.bias = -0.0005;

scene.add(dirLight);

// TABLE GROUP (for reference)
const group = new THREE.Group();
group.name = 'tables'
// create cube
function createTable(x,y,z) {
  const geometry = new THREE.BoxGeometry( 5, 1, 3 );
  const material = new THREE.MeshStandardMaterial( { map: tableTexture } );
  const cube = new THREE.Mesh( geometry, material );

  cube.castShadow = true;
  cube.position.set(x,y,z);
  group.add(cube);
}

for (let i=0; i<2; i++) {
  let x = Math.random() *10;
  let y = 0;
  let z = Math.random() *10;
  createTable(x,y,z);
}

scene.add(group);

// Initialize MTLLoader
const mtlLoader = new MTLLoader();

// Initialize OBJLoader
const objLoader = new OBJLoader();

// TEXTURED CAT
mtlLoader.load('/assets/models/cat/cat.mtl', function(materials) {
  materials.preload();

  // Initialize OBJLoader
  objLoader.setMaterials(materials); // Set the loaded materials to OBJLoader
  objLoader.load('/assets/models/cat/cat.obj', function(object) {
      object.scale.set(0.01, 0.01, 0.01); // Scale to half size in all dimensions
      scene.add(object);
      object.position.set(0, 0, 0); // Adjust position if needed
  });
});


// // BLANK CAT
// // Initialize OBJLoader
// const objLoader = new OBJLoader();
// objLoader.load('/assets/models/cat.obj', function(object) {
//     object.scale.set(0.01, 0.01, 0.01); // Scale to half size in all dimensions
//     scene.add(object);
//     object.position.set(0, 0, 0); // Adjust position if needed
// });

// TEXTURED COFFEE CUP
mtlLoader.load('/assets/models/coffeecup/coffeecup.mtl', function(materials) {
    materials.preload();

    // Initialize OBJLoader
    objLoader.setMaterials(materials); // Set the loaded materials to OBJLoader
    objLoader.load('/assets/models/coffeecup/coffeecup.obj', function(object) {
        object.scale.set(0.01, 0.01, 0.01); // Scale to half size in all dimensions
        scene.add(object);
        object.position.set(5, 0, 0); // Adjust position if needed
    });
});


// // create table
// const geometry = new THREE.BoxGeometry( 5, 1, 3 );
// const material = new THREE.MeshStandardMaterial( { map: tableTexture } );
// const cube = new THREE.Mesh( geometry, material );

// cube.castShadow = true;
// cube.position.set(0,0,0);
// scene.add(cube);


// create a very large ground plane
const groundGeometry = new THREE.PlaneBufferGeometry(100, 100);
const groundMaterial = new THREE.MeshLambertMaterial({
  color: 0xffffff,
});
const groundMesh = new THREE.Mesh(groundGeometry, metalMaterial);
groundMesh.receiveShadow = true;
groundMesh.position.set(0, -2, 0);
groundMesh.rotation.set(Math.PI / -2, 0, 0);
scene.add(groundMesh);

const roofMesh = new THREE.Mesh(groundGeometry, wallMaterial);
roofMesh.receiveShadow = true;
roofMesh.position.set(0, 13, 0);
roofMesh.rotation.set(Math.PI / 2, 0, 0);
scene.add(roofMesh);

const wallMesh1 = new THREE.Mesh(groundGeometry, wallMaterial);
wallMesh1.receiveShadow = true;
wallMesh1.position.set(20, 10.5, 0);
wallMesh1.rotation.set(0, Math.PI / -2, 0);
scene.add(wallMesh1);

const wallMesh2 = new THREE.Mesh(groundGeometry, wallMaterial);
wallMesh2.receiveShadow = true;
wallMesh2.position.set(-20, 10.5, 0);
wallMesh2.rotation.set(0, Math.PI / 2, 0);
scene.add(wallMesh2);

const wallMesh3 = new THREE.Mesh(groundGeometry, wallMaterial);
wallMesh3.receiveShadow = true;
wallMesh3.position.set(0, 10.5, 20);
wallMesh3.rotation.set(0, Math.PI, Math.PI / -2);
scene.add(wallMesh3);

const wallMesh4 = new THREE.Mesh(groundGeometry, wallMaterial);
wallMesh4.receiveShadow = true;
wallMesh4.position.set(0, 10.5, -20);
wallMesh4.rotation.set(0,0, Math.PI / 2);
scene.add(wallMesh4);



// add orbitcontrols
const controller = new OrbitControls(camera, renderer.domElement);
controller.enableDamping = true;
controller.dampingFactor = 0.05;
controller.minDistance = 3;
controller.maxDistance = 10;
controller.minPolarAngle = Math.PI / 4;
controller.maxPolarAngle = (3 * Math.PI) / 4;

const d_original = controller.getDistance()
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// mouse detection 
function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) *2 -1;
  mouse.y = -(event.clientX / window.innerHeight) *2 +1;
}

window.addEventListener("mousemove",onMouseMove,false);

// render
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera); 
  
  let d = controller.getDistance()
  // octa.rotation.y -= 1 / d;
  // octa.material.color.r = 1 / d;
  // octa.material.color.g = d / d_original; 

  // torusKnotMesh.rotation.x -= 0.05;
  // torusKnotMesh.rotation.y -= 0.05;
  
  // selection (turning plumbobs red)
  // raycaster.setFromCamera(mouse, camera);
  // const octa = scene.getObjectByName('plumbobs').children;
  // const intersects = raycaster.intersectObjects(octa);
  // if (intersects.length > 0) {
  //   controller.enabled = false;
  //   intersects[0].object.material.color.set(0xff0000)
  //   // ('plumbobs').children[0].material.color.set(0xff0000)
  // } else {
  //   controller.enabled = true;
  //   intersects[0].object.material.color.set(0x00ff00);
  //   // ('plumbobs').children[0].material.color.set(0x00ff00);
  // }

  controller.update();
}

window.addEventListener("mousemove", onMouseMove, false);

animate();
