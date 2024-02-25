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
// camera.position.set(5, 4, 10)
camera.position.set(8, 8, 8)
camera.lookAt(0, 0, 0)
// add flying interaction
const flyControls = new FlyControls(camera, renderer.domElement);
flyControls.movementSpeed = 0.1
// grid helper
const size = 110;
const divisions = 110;
const gridHelper = new THREE.GridHelper(size, divisions, '#00f', '#6fcdf7');
scene.add(gridHelper);



//  LOOP
function animate() {
  requestAnimationFrame(animate);

  flyControls.update(1);

  renderer.render(scene, camera);
}
animate();

</script>
  
<template>
  <!-- <main></main> -->
</template>
  