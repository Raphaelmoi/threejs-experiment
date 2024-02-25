<script setup lang="ts">
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls.js';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { Water } from 'three/examples/jsm/objects/Water.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js';

let water, sun, mesh;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

renderer.toneMapping = THREE.ACESFilmicToneMapping;

document.body.appendChild(renderer.domElement);

// default camera position
// camera.position.set(5, 4, 10)
camera.position.set(8, 0.4, 8)
camera.lookAt(0, 0, 0)
// add flying interaction
const flyControls = new FirstPersonControls(camera, renderer.domElement);
flyControls.movementSpeed = 0.1
flyControls.lookSpeed = 0.001
// grid helper
const size = 110;
const divisions = 110;
const gridHelper = new THREE.GridHelper(size, divisions, '#00f', '#6fcdf7');
// scene.add(gridHelper);

// GUI
const parameters = {
  elevation: 2,
  azimuth: 180
};

const pmremGenerator = new THREE.PMREMGenerator(renderer);
let renderTarget;

createOcean()

const sky = new Sky();
createSky()

const gui = new GUI();

const folderSky = gui.addFolder('Sky');
folderSky.add(parameters, 'elevation', 0, 90, 0.1).onChange(updateSun);
folderSky.add(parameters, 'azimuth', - 180, 180, 0.1).onChange(updateSun);
folderSky.open();

const waterUniforms = water.material.uniforms;

const folderWater = gui.addFolder('Water');
folderWater.add(waterUniforms.distortionScale, 'value', 0, 8, 0.1).name('distortionScale');
folderWater.add(waterUniforms.size, 'value', 0.1, 10, 0.1).name('size');
folderWater.open();


//

//  LOOP
function animate() {
  requestAnimationFrame(animate);
  // camera min high
  if (camera.position.y < 0.4) {
    camera.position.y = 0.4
  }

  const time = performance.now() * 0.001;

  water.material.uniforms['time'].value += 1.0 / 60.0;


  flyControls.update(1);

  renderer.render(scene, camera);
}
animate();




function createOcean() {

  // Water
  const waterGeometry = new THREE.PlaneGeometry(10000, 10000);

  water = new Water(
    waterGeometry,
    {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: new THREE.TextureLoader().load('/waternormals.jpg', function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      }),
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 3.7,
      // distortionScale: 370,
      fog: scene.fog !== undefined
    }
  );

  water.rotation.x = - Math.PI / 2;

  scene.add(water);
}
function createSky() {
  sun = new THREE.Vector3();

  sky.scale.setScalar(10000);
  scene.add(sky);

  const skyUniforms = sky.material.uniforms;

  skyUniforms['turbidity'].value = 100;
  skyUniforms['rayleigh'].value = 2;
  skyUniforms['mieCoefficient'].value = 0.005;
  skyUniforms['mieDirectionalG'].value = 0.8;


  updateSun();
}

function updateSun() {

  const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
  const theta = THREE.MathUtils.degToRad(parameters.azimuth);

  sun.setFromSphericalCoords(1, phi, theta);

  sky.material.uniforms['sunPosition'].value.copy(sun);
  water.material.uniforms['sunDirection'].value.copy(sun).normalize();

  if (renderTarget !== undefined) renderTarget.dispose();

  renderTarget = pmremGenerator.fromScene(sky);

  scene.environment = renderTarget.texture;

}

</script>
  
<template>
  <!-- <main></main> -->
</template>
  