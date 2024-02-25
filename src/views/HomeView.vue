<script setup lang="ts">
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls.js';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ambiant light
var spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(30, 70, 100);
spotLight.intensity = 2;
scene.add(spotLight);
// default camera position
camera.position.set(5, 4, 10)
// add flying interaction
const flyControls = new FlyControls(camera, renderer.domElement);
flyControls.movementSpeed = 0.1
// grid helper
// const size = 110;
// const divisions = 110;
// const gridHelper = new THREE.GridHelper(size, divisions);
// scene.add(gridHelper);
// Damier

const positions = [] /**  store each item positon*/
const grid = 100
const gridElements = []
for (let i = 0 - grid * 0.5; i < grid * 0.5; i++) {
  for (let j = 0 - grid * 0.5; j < grid * 0.5; j++) {
    positions.push([i, j])
  }
}
const geo = new THREE.BoxGeometry(1, 1, 1, 1, 1)
for (let i = 0; i < grid * grid; i++) {
  const color = [0x111111, 0xEEEEEE][Math.round(Math.random() * 1)]
  if (color === 0xEEEEEE) {
    const mat = new THREE.MeshPhongMaterial({ color })
    const cub = new THREE.Mesh(geo, mat)
    cub.position.set(positions[i][1], 0, positions[i][0]);
    // cub.castShadow = true;

    gridElements.push(cub)

    scene.add(cub);
  }

}
// Personage
let drone: THREE.Object3D<THREE.Event> | THREE.Group

const loader = new GLTFLoader();

loader.load('/free_merc_hovercar/scene.gltf', (gltf) => {
  drone = gltf.scene
  drone.rotateX(90)
  // drone.position.set(3, 2, 0)

  const directionalLight = new THREE.DirectionalLight(0x2222FF, .5);
  directionalLight.position.set(2, 2, -1)
  drone.add(directionalLight);

  const directionalLight2 = new THREE.DirectionalLight(0xFFFFFF, 1);
  directionalLight2.position.set(0, 1, 1)
  drone.add(directionalLight2);

  scene.add(drone);
  // drone.position.set(0, 2, 5);

}, undefined,
  function (error) { console.error(error); });

//  LOOP
function animate() {
  requestAnimationFrame(animate);

  flyControls.update(1);

  if (drone) {
    drone.position.copy(camera.position);
    drone.rotation.copy(camera.rotation);
    drone.updateMatrix();
    drone.translateZ(-1.5);
    drone.translateY(-.25);
    // drone.translateX(-.5);
    drone.rotateY(-3)
    // drone.rotateX(5)
  }

  renderer.render(scene, camera);
}
animate();

</script>

<template>
  <!-- <main></main> -->
</template>
