<script setup lang="ts">
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls.js';


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);



// ambiant light
var spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(100, 1000, 0);
spotLight.intensity = 0.7;
scene.add(spotLight);

var spotLight3 = new THREE.AmbientLight(0x8888cc);
spotLight3.position.set(100, 100, -100);
spotLight3.intensity = .3;
scene.add(spotLight3);


var spotLight2 = new THREE.AmbientLight(0x666666);
spotLight2.position.set(-200, -100, -100);
spotLight2.intensity = 1;
scene.add(spotLight2);

// const light = new THREE.HemisphereLight(0x000000, 0x282828, 1);
// scene.add(light);

// default camera position
camera.position.set(0, 50, 0)
// add flying interaction
const flyControls = new FlyControls(camera, renderer.domElement);
flyControls.movementSpeed = 0.1
// grid helper
// const size = 110;
// const divisions = 110;
// const gridHelper = new THREE.GridHelper(size, divisions);
// scene.add(gridHelper);
// // Damier

const positions = [] /**  store each item positon*/
const grid = 10
const gridElements = []

var rigidBody_List = new Array();



for (let i = 0 - grid * 0.5; i < grid * 0.5; i++) {
  for (let j = 0 - grid * 0.5; j < grid * 0.5; j++) {
    // const velocity = [0.01, 0.05, 0.03, 0.01, 0.01, 0.02][Math.round(Math.random() * 5)]
    const hauteur = Math.random() * 100
    // positions.push([i, j, { velocity }])
    positions.push([i, j, hauteur])
  }
}
const geo = new THREE.SphereGeometry(0.5, 20, 20)
for (let i = 0; i < grid * grid; i++) {
  // const color = [0x111111, 0x111111, 0xEEEEEE][Math.round(Math.random() * 2)]
  // if (color === 0xEEEEEE) {
  const mat = new THREE.MeshPhongMaterial({ color: 0xEEEEEE })
  const cub = new THREE.Mesh(geo, mat)
  cub.position.set(positions[i][1], positions[i][2], positions[i][0]);
  // cub.castShadow = true;
  // const geometry = new THREE.SphereGeometry( 15, 32, 16 );


  // ------ Physics Universe - Ammo.js ------


  gridElements.push(cub)

  scene.add(cub);
  // }
  // cub.cursor = 'pointer';
  // cub.on('click', function (ev) {

  // });

}
// Personage
// let drone: THREE.Object3D<THREE.Event> | THREE.Group

// const loader = new GLTFLoader();

// loader.load('/free_merc_hovercar/scene.gltf', (gltf) => {
//   drone = gltf.scene
//   drone.rotateX(90)

//   scene.add(drone);

// }, undefined,
//   function (error) { console.error(error); });

//  LOOP
function animate() {
  requestAnimationFrame(animate);

  flyControls.update(1);
  gridElements.forEach(element => {
    if (element.position.y > 0) { element.translateY(-0.2) }
    else { element.translateY(100) }
  })


  // if (drone) {
  //   drone.position.copy(camera.position);
  //   drone.rotation.copy(camera.rotation);
  //   drone.updateMatrix();
  //   drone.translateZ(-1.5);
  //   drone.translateY(-.25);
  //   drone.rotateY(-3)
  // }
  // gridElements.forEach((element, index) => {
  //   element.translateY(positions[index][2].velocity)
  // });
  renderer.render(scene, camera);
}
animate();





</script>

<template>
  <!-- <main></main> -->
</template>
