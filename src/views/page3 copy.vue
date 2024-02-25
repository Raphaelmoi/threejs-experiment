<script setup lang="ts">
import type { Mesh, Quaternion, Vector3, Vector4 } from 'three';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// ammo dans index.html

var physicsUniverse = undefined;
var tmpTransformation = undefined;
let controls

const floor = -60

Ammo().then(AmmoStart);
function AmmoStart() {

  tmpTransformation = new Ammo.btTransform();

  initPhysicsUniverse();
  initGraphicsUniverse();

  // base
  createFloor()

  // falling cubes
  createCube({ scale: 12, position: new THREE.Vector3(10, 30, 0), mass: 3, rot_quaternion: { x: 0, y: 10, z: -20, w: 1 } });
  createCube({ scale: 2, position: new THREE.Vector3(10, 20, 10), mass: 3, rot_quaternion: null });
  createCube({ scale: 4, position: new THREE.Vector3(5, 40, 20), mass: 3, rot_quaternion: null });
  createCube({ scale: 6, position: new THREE.Vector3(20, 60, 25), mass: 3, rot_quaternion: null });
  createCube({ scale: 8, position: new THREE.Vector3(20, 100, 25), mass: 3, rot_quaternion: null });
  createCube({ scale: 8, position: new THREE.Vector3(0, 10, 0), mass: 3, rot_quaternion: null });
  createCube({ scale: 4, position: new THREE.Vector3(20, 200, 25), mass: 3, rot_quaternion: null });
  createCube({ scale: 60, position: new THREE.Vector3(100, floor, 100), mass: 100, rot_quaternion: null });

  for (let i = 0; i < 100; i++) {
    const Y = 60 + (i * (3 * i))
    const H = new THREE.Vector3(20, Y, 25)
    createSphere({ scale: 8, position: H, mass: 10, rot_quaternion: null });
  }

  render();
}

function initPhysicsUniverse() {
  var collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
  var dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
  var overlappingPairCache = new Ammo.btDbvtBroadphase();
  var solver = new Ammo.btSequentialImpulseConstraintSolver();

  physicsUniverse = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);

  physicsUniverse.setGravity(new Ammo.btVector3(0, -75, 0));
}

var scene = undefined;
var camera = undefined;
var renderer = undefined;
var clock = undefined;

function initGraphicsUniverse() {
  clock = new THREE.Clock();
  scene = new THREE.Scene();
  // camera
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
  // camera.position.set(-25, 20, -25);
  camera.position.set(-100, 20, -100);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  //renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  //light
  var ambientLight = new THREE.AmbientLight(0x9999FF, 0.2);
  scene.add(ambientLight);

  var directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
  directionalLight.position.set(-1, 0.9, 0.4);
  scene.add(directionalLight);

  controls = new OrbitControls(camera, renderer.domElement);
}

var rigidBody_List = new Array();
// ==================================================================
// ==================================================================
// ==                CUBE                  ===============================================
function createCube({ scale, position, mass, rot_quaternion }: any) {
  // ------ Graphics Universe - Three.JS ------
  const size = Array(3).fill(scale)
  const newcube = initThreeCube(size, position)
  scene.add(newcube);
  rigidBody_List.push(newcube);
  // ------ Physics Universe - Ammo.js ------
  const RBody = initCubeBody({ x: size, y: size, z: size }, position, rot_quaternion, mass)
  physicsUniverse.addRigidBody(RBody);

  newcube.userData.physicsBody = RBody;
}

function initThreeCube(scale: number[], position: Vector3): Mesh {
  console.log(scale)
  let myCube = new THREE.Mesh(
    new THREE.BoxBufferGeometry(...scale),
    new THREE.MeshPhongMaterial({ color: Math.random() * 0xffffff }));
  myCube.position.set(position.x, position.y, position.z);

  return myCube
}

function initCubeBody(scale: any, position: Vector3, quaternion: any, mass: number): Mesh {
  let my_quaternion = quaternion || { x: 0, y: 0, z: 0, w: 1 };
  console.log(my_quaternion)
  let transform = new Ammo.btTransform();
  transform.setIdentity();
  transform.setOrigin(new Ammo.btVector3(position.x, position.y, position.z));
  transform.setRotation(new Ammo.btQuaternion(my_quaternion.x, my_quaternion.y, my_quaternion.z, my_quaternion.w));
  let defaultMotionState = new Ammo.btDefaultMotionState(transform);

  let structColShape = new Ammo.btBoxShape(new Ammo.btVector3(scale.x * 0.5, scale.y * 0.5, scale.z * 0.5));
  structColShape.setMargin(0.05);

  let localInertia = new Ammo.btVector3(0, 0, 0);
  structColShape.calculateLocalInertia(mass, localInertia);

  let RBody_Info = new Ammo.btRigidBodyConstructionInfo(mass, defaultMotionState, structColShape, localInertia);
  let myCubeBody = new Ammo.btRigidBody(RBody_Info);

  return myCubeBody
}
// ==================================================================
// ==================================================================

function createFloor() {
  // const size = 1000
  // // const scale = [size, 0, size]
  // const position = new THREE.Vector3(-1, 0.9, 0.4)
  // const scale = new THREE.Vector3(size, 0, size)
  // const mass = 0
  // const quaternion = { x: 0, y: 0, z: 0, w: 1 }

  // const newcube = initThreeCube(scale, position)
  // scene.add(newcube);
  // rigidBody_List.push(newcube);
  // // ------ Physics Universe - Ammo.js ------
  // const RBody = initCubeBody({ x: size, y: 0, z: size }, position, quaternion, mass)
  // physicsUniverse.addRigidBody(RBody);

  // newcube.userData.physicsBody = RBody;

  // newcube.name = 'FLOOR'
  // rigidBody_List.push(newcube);

}
// ==================================================================
// ==================================================================
// function createSphere({ scale, position, mass, rot_quaternion }: any) {

//   let quaternion = undefined;
//   if (rot_quaternion == null) {
//     quaternion = { x: 0, y: 0, z: 0, w: 1 };
//   }
//   else {
//     quaternion = rot_quaternion;
//   }
//   // ------ Graphics Universe - Three.JS ------
//   let newcube = new THREE.Mesh(
//     new THREE.SphereBufferGeometry(scale, scale, scale),
//     new THREE.MeshPhongMaterial({ color: Math.random() * 0xffffff }));

//   newcube.position.set(position.x, position.y, position.z);
//   scene.add(newcube);

//   // ------ Physics Universe - Ammo.js ------
//   let transform = new Ammo.btTransform();
//   transform.setIdentity();
//   transform.setOrigin(new Ammo.btVector3(position.x, position.y, position.z));
//   transform.setRotation(new Ammo.btQuaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w));
//   let defaultMotionState = new Ammo.btDefaultMotionState(transform);

//   let structColShape = new Ammo.btSphereShape(scale);
//   // let structColShape = new Ammo.btBoxShape(new Ammo.btVector3(scale, scale, scale));
//   structColShape.setMargin(0.05);

//   let localInertia = new Ammo.btVector3(0, 0, 0);
//   structColShape.calculateLocalInertia(mass, localInertia);

//   let RBody_Info = new Ammo.btRigidBodyConstructionInfo(mass, defaultMotionState, structColShape, localInertia);
//   let RBody = new Ammo.btRigidBody(RBody_Info);

//   physicsUniverse.addRigidBody(RBody);
//   newcube.userData.physicsBody = RBody;
//   rigidBody_List.push(newcube);

// }
function createSphere({ scale, position, mass, rot_quaternion }: any) {

  let quaternion = undefined;
  if (rot_quaternion == null) {
    quaternion = { x: 0, y: 0, z: 0, w: 1 };
  }
  else {
    quaternion = rot_quaternion;
  }
  // ------ Graphics Universe - Three.JS ------
  let newcube = new THREE.Mesh(
    new THREE.SphereBufferGeometry(scale, scale, scale),
    new THREE.MeshPhongMaterial({ color: Math.random() * 0xffffff }));

  newcube.position.set(position.x, position.y, position.z);
  scene.add(newcube);

  // ------ Physics Universe - Ammo.js ------
  let transform = new Ammo.btTransform();
  transform.setIdentity();
  transform.setOrigin(new Ammo.btVector3(position.x, position.y, position.z));
  transform.setRotation(new Ammo.btQuaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w));
  let defaultMotionState = new Ammo.btDefaultMotionState(transform);

  let structColShape = new Ammo.btSphereShape(scale);
  // let structColShape = new Ammo.btBoxShape(new Ammo.btVector3(scale, scale, scale));
  structColShape.setMargin(0.05);

  let localInertia = new Ammo.btVector3(0, 0, 0);
  structColShape.calculateLocalInertia(mass, localInertia);

  let RBody_Info = new Ammo.btRigidBodyConstructionInfo(mass, defaultMotionState, structColShape, localInertia);
  let RBody = new Ammo.btRigidBody(RBody_Info);

  physicsUniverse.addRigidBody(RBody);
  newcube.userData.physicsBody = RBody;
  rigidBody_List.push(newcube);

}
// ==================================================================
// ==================================================================
function updatePhysicsUniverse(deltaTime) {
  physicsUniverse.stepSimulation(deltaTime, 10);

  for (let i = 0; i < rigidBody_List.length; i++) {
    const Graphics_Obj = rigidBody_List[i];

    let Physics_Obj = Graphics_Obj.userData.physicsBody;

    let motionState = Physics_Obj.getMotionState();

    // if (motionState && Graphics_Obj.geometry.type === "SphereGeometry") {
    if (motionState && Graphics_Obj.name !== "FLOOR") {
      motionState.getWorldTransform(tmpTransformation);
      let new_pos = tmpTransformation.getOrigin();
      let new_qua = tmpTransformation.getRotation();
      Graphics_Obj.position.set(new_pos.x(), new_pos.y(), new_pos.z());
      Graphics_Obj.quaternion.set(new_qua.x(), new_qua.y(), new_qua.z(), new_qua.w());
    }
  }

}



function render() {
  let deltaTime = clock.getDelta();
  updatePhysicsUniverse(deltaTime);

  controls.update();

  renderer.render(scene, camera);
  requestAnimationFrame(render);
}


</script>

<template>
  <!-- <main></main> -->
</template>
