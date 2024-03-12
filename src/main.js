import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DragControls } from 'three/examples/jsm/controls/DragControls.js';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';

// textures
const textureLoader = new THREE.TextureLoader(); 

// ground texture
const metalTexture = textureLoader.load
  ('assets/textures/wood/floor-parquet-pattern-172292.jpg') // make sure this file exists!
metalTexture.wrapS = THREE.RepeatWrapping; // horizontal wrapping
metalTexture.wrapT = THREE.RepeatWrapping; // vertical wrapping
metalTexture.repeat.set( 4, 4 ); // how many times to repeat

// wood table texture
const tableTexture = textureLoader.load
  ('/assets/textures/wood/abstract-antique-backdrop-164005.jpg')
  
// wall texture
const wallTexture = textureLoader.load
  ('/assets/textures/wood/abstract-antique-backdrop-164005.jpg')
wallTexture.wrapS = THREE.RepeatWrapping; // horizontal wrapping
wallTexture.wrapT = THREE.RepeatWrapping; // vertical wrapping
wallTexture.repeat.set( 4, 4 ); // how many times to repeat
  

const exrLoader = new EXRLoader()

const bumpMap = new THREE.TextureLoader().load(
  'assets/textures/wood/floor-parquet-pattern-172292.jpg',
  (metalTexture) => {
    metalTexture.wrapS = THREE.RepeatWrapping; // horizontal wrapping
    metalTexture.wrapT = THREE.RepeatWrapping; // vertical wrapping
    metalTexture.repeat.set( 4, 4 ); // how many times to repeat
    metalTexture.side = THREE.DoubleSide;
  }
)


const wallBumpMap = new THREE.TextureLoader().load(
  '/assets/textures/wood/abstract-antique-backdrop-164005.jpg',
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

// scene.add(group);

// Initialize MTLLoader
const mtlLoader = new MTLLoader();

// Initialize OBJLoader
const objLoader = new OBJLoader();
const catobjLoader = new OBJLoader();
const cupobjLoader = new OBJLoader();
const tvobjLoader = new OBJLoader();
const doorobjLoader = new OBJLoader();
const tableobjLoader = new OBJLoader();
const keyobjLoader = new OBJLoader();

const loadCat = () => {
  // TEXTURED CAT
  mtlLoader.load('/assets/models/cat/cat.mtl', function(materials) {
    materials.preload();

    // Initialize OBJLoader
    catobjLoader.setMaterials(materials); // Set the loaded materials to OBJLoader
    catobjLoader.load('/assets/models/cat/cat.obj', function(object) {
        object.scale.set(0.01, 0.01, 0.01); // Scale to half size in all dimensions
        scene.add(object);
        object.position.set(0, 0, 0); // Adjust position if needed
    });
  });
}

const loadTv = () => {
  // TEXTURED TV
  mtlLoader.load('/assets/models/tv/tv.mtl', function(materials) {
    materials.preload();

    // Initialize OBJLoader
    tvobjLoader.setMaterials(materials); // Set the loaded materials to OBJLoader
    tvobjLoader.load('/assets/models/tv/tv.obj', function(object) {
        object.scale.set(0.03, 0.03, 0.03); // Scale to half size in all dimensions
        scene.add(object);
        object.position.set(0, 0, -16); // Adjust position if needed
    });
  });
}

const loadDoor = () => {
  // TEXTURED DOOR
  mtlLoader.load('/assets/models/door/door.mtl', function(materials) {
    materials.preload();

    // Initialize OBJLoader
    doorobjLoader.setMaterials(materials); // Set the loaded materials to OBJLoader
    doorobjLoader.load('/assets/models/door/door.obj', function(object) {
        object.scale.set(0.03, 0.03, 0.03); // Scale to half size in all dimensions
        // object.rotation.set(0, Math.PI / 2);
        scene.add(object);
        object.position.set(-17, 0, -20); // Adjust position if needed
    });
  });
}

const loadTable = () => {
  // TEXTURED TABLE
  mtlLoader.load('/assets/models/table/table.mtl', function(materials) {
    materials.preload();

    // Initialize OBJLoader
    tableobjLoader.setMaterials(materials); // Set the loaded materials to OBJLoader
    tableobjLoader.load('/assets/models/table/table.obj', function(object) {
        object.scale.set(0.03, 0.03, 0.03); // Scale to half size in all dimensions
        // object.rotation.set(0, Math.PI / 2);
        scene.add(object);
        object.position.set(0, 0, 0); // Adjust position if needed
    });
  });
}
loadCat();;
loadTv();
loadDoor();
loadTable();


// create a very large ground plane
const groundGeometry = new THREE.PlaneGeometry(100, 100);
const groundMaterial = new THREE.MeshLambertMaterial({
  color: 0xffffff,
});
const groundMesh = new THREE.Mesh(groundGeometry, metalMaterial);
groundMesh.receiveShadow = true;
groundMesh.position.set(0, 0, 0);
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

const objects = []; // This array will hold your OBJ model and any other objects you want draggable

cupobjLoader.load(
    '/assets/models/coffeecup/coffeecup.obj',
    function (object) {
        // Add the loaded object to the scene
        scene.add(object);
        object.scale.set(0.008, 0.008, 0.008);
        object.position.set(-2.5, 3, -1);
        objects.push(object);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.log('An error happened');
    }
);

mtlLoader.load('/assets/models/key/key.mtl', function(materials) {
  materials.preload();

  keyobjLoader.load(
    '/assets/models/key/key.obj',
    function (object) {
        // Add the loaded object to the scene
        scene.add(object);
        object.scale.set(0.002, 0.002, 0.002);
        object.position.set(-2.75, 3, -1.35);
        objects.push(object);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.log('An error happened');
    }
  );
});

// DRAG CONTROLS
// Set up drag controls
const dragControls = new DragControls(objects, camera, renderer.domElement);

// Add event listeners for drag events, if needed
dragControls.addEventListener('dragstart', function (event) {
    controller.enabled = false; // Disable orbit controls while dragging
});

dragControls.addEventListener('dragend', function (event) {
    controller.enabled = true; // Re-enable orbit controls after dragging
});

dragControls.addEventListener('dragstart', function (event) {
  console.log('Drag started');
  // Implement any specific logic you need when dragging starts
});

dragControls.addEventListener('dragend', function (event) {
  console.log('Drag ended');
  // Implement any specific logic you need when dragging ends
});

// OBJECT COLLISIONS!!
// Assuming 'objects' is an array of THREE.Mesh objects

// function checkIntersections(objects) {
//   let intersectPairs = []; // Store pairs of intersecting objects

//   for (let i = 0; i < objects.length; i++) {
//       const box1 = new THREE.Box3().setFromObject(objects[i]);

//       for (let j = i + 1; j < objects.length; j++) {
//           const box2 = new THREE.Box3().setFromObject(objects[j]);

//           if (box1.intersectsBox(box2)) {
//               // If these objects intersect, add the pair to the list
//               intersectPairs.push([objects[i], objects[j]]);
//               console.log(`Objects at indices ${i} and ${j} intersect.`);
//           }
//       }
//   }

//   return intersectPairs; // Returns an array with pairs of intersecting objects
// }

// const intersectingPairs = checkIntersections(objects);

const loader = new OBJLoader();
const threeObjects = []; // Array to hold the THREE.Object3D instances

objects.forEach(obj => {
    loader.load(obj.path, (object) => { // Assuming each 'obj' has a 'path' property
        threeObjects.push(object);
        if (threeObjects.length === objects.length) {
            // All models are loaded
            checkIntersections(threeObjects);
        }
    });
});

function checkIntersections(threeObjects) {
  for (let i = 0; i < threeObjects.length; i++) {
      for (let j = i + 1; j < threeObjects.length; j++) {
          const box1 = new THREE.Box3().setFromObject(threeObjects[i]);
          const box2 = new THREE.Box3().setFromObject(threeObjects[j]);
          if (box1.intersectsBox(box2)) {
              console.log(`Object ${i} intersects with Object ${j}`);
          }
      }
  }
}


// AUDIO!!!
// create an AudioListener and add it to the camera
const listener = new THREE.AudioListener();
camera.add( listener );

// create a global audio source
const sound = new THREE.Audio( listener );

// load a sound and set it as the Audio object's buffer
const audioLoader = new THREE.AudioLoader();
audioLoader.load( '/assets/sounds/meow/meow.mp3', function( buffer ) {
	sound.setBuffer( buffer );
	sound.setLoop(true);
	sound.setVolume(0.5);
	sound.play();
});


// CAMERA MOVEMENT!!
//moving variables
let left = false;
let right = false;
let forward = false;
let back = false;

//event listeners

function onKeyDown(e){
  if (e.keyCode == 87 || e.keyCode == 38) {
    forward=true;
  } else if (e.keyCode == 83 || e.keyCode == 40){
    back=true;
  } else if (e.keyCode == 65 || e.keyCode == 37){
    left=true;
  } else if (e.keyCode == 68 || e.keyCode == 39){
    right=true;
  }
  
}

function onKeyUp(e){
  if (e.keyCode == 87 || e.keyCode == 38) {
    forward=false;
  } else if (e.keyCode == 83 || e.keyCode == 40){
    back=false;
  } else if (e.keyCode == 65 || e.keyCode == 37){
    left=false;
  } else if (e.keyCode == 68 || e.keyCode == 39){
    right=false;
  }
}

function onMouseMove(event){
  mouse.x = (event.clientX /window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

window.addEventListener("keyup", onKeyUp, false);
window.addEventListener("keydown", onKeyDown, false);
window.addEventListener("mousemove", onMouseMove, false);

// RENDER!!
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera); 
  
  let d = controller.getDistance()

  const moveSpeed = 0.5;
    const rotationSpeed = 1;
    if (forward){
      camera.position.x -= moveSpeed*Math.sin(camera.rotation.y);
      camera.position.z -= moveSpeed*Math.cos(camera.rotation.y);
    }
    if (back) {
      camera.position.x += moveSpeed*Math.sin(camera.rotation.y)
      camera.position.z += moveSpeed*Math.cos(camera.rotation.y)
    }
    if (left) {
      camera.rotation.y += rotationSpeed*Math.PI/100;
    }
    if (right) {
      camera.rotation.y -= rotationSpeed*Math.PI/100;
    }

  controller.update();
}

animate();
