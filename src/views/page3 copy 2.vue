<script setup lang="ts">
import type { Camera, Clock, Mesh, Quaternion, Renderer, Scene, Vector3 } from 'three';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// ammo dans index.html

var physicsUniverse: any = undefined;
var tmpTransformation: any = undefined;
let controls: OrbitControls

const floor = -60

var scene: Scene
var camera: Camera
var renderer: Renderer
var clock: Clock;
var rigidBody_List = new Array();

Ammo().then(AmmoStart);
function AmmoStart() {

  tmpTransformation = new Ammo.btTransform();

  initPhysicsUniverse();
  initGraphicsUniverse();

  // base
  createFloor()

  // falling cubes
  createCube({ scale: 12, position: v3(10, 30, 0), mass: 3, rot_quaternion: { x: 0, y: 10, z: -20, w: 1 } });
  createCube({ scale: 2, position: v3(10, 20, 10), mass: 3, rot_quaternion: null });
  createCube({ scale: 4, position: v3(5, 40, 20), mass: 3, rot_quaternion: null });
  createCube({ scale: 6, position: v3(20, 60, 25), mass: 3, rot_quaternion: null });
  createCube({ scale: 8, position: v3(20, 100, 25), mass: 3, rot_quaternion: null });
  createCube({ scale: 8, position: v3(0, 10, 0), mass: 3, rot_quaternion: null });
  createCube({ scale: 4, position: v3(20, 200, 25), mass: 3, rot_quaternion: null });
  createCube({ scale: 60, position: v3(100, floor, 100), mass: 100, rot_quaternion: null });

  for (let i = 0; i < 100; i++) {
    const Y = 60 + (i * (3 * i))
    const position = v3(20, Y, 25)

    createSphere({ scale: 8, position, mass: 10, rot_quaternion: null });
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

function initGraphicsUniverse() {
  clock = new THREE.Clock();
  scene = new THREE.Scene();
  // camera
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(-100, 20, -100);
  camera.lookAt(v3(0, 0, 0));

  //renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  //light
  var ambientLight = new THREE.AmbientLight(0x9999FF, 0.2);
  scene.add(ambientLight);

  var directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
  directionalLight.position.set(-1, 0.9, 0.4);
  scene.add(directionalLight);
  // control point of view POV
  controls = new OrbitControls(camera, renderer.domElement);
}

// ==================================================================
// ==================================================================
// ==                CUBE                  ===============================================
// return the created mesh
function initThreeCube({ scale, position, color }: any): Mesh {
  let myColor = color || Math.random() * 0xffffff

  let myCube = new THREE.Mesh(
    new THREE.BoxBufferGeometry(...scale),
    new THREE.MeshPhongMaterial({ color: myColor }));
  myCube.position.set(position.x, position.y, position.z);

  return myCube
}
// return the physical Ammo item 
function initCubeBody({ scale, position, quaternion, mass }: any): any {
  let transform = new Ammo.btTransform();
  transform.setIdentity();
  transform.setOrigin(new Ammo.btVector3(position.x, position.y, position.z));
  if (quaternion) {
    transform.setRotation(new Ammo.btQuaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w));
  }
  let defaultMotionState = new Ammo.btDefaultMotionState(transform);

  let structColShape = new Ammo.btBoxShape(new Ammo.btVector3(scale[0] * 0.5, scale[1] * 0.5, scale[2] * 0.5));
  structColShape.setMargin(0.05);

  let localInertia = new Ammo.btVector3(0, 0, 0);
  structColShape.calculateLocalInertia(mass, localInertia);

  let RBody_Info = new Ammo.btRigidBodyConstructionInfo(mass, defaultMotionState, structColShape, localInertia);
  let myCubeBody = new Ammo.btRigidBody(RBody_Info);

  return myCubeBody
}
// ==================================================================
// ==================================================================
function createCube({ scale, position, mass, rot_quaternion }: any) {
  let quaternion = rot_quaternion || { x: 0, y: 0, z: 0, w: 1 };
  const size = Array(3).fill(scale)
  // ------ Graphics Universe - Three.JS ------
  const newcube = initThreeCube({ scale: size, position })
  scene.add(newcube);
  rigidBody_List.push(newcube);
  // ------ Physics Universe - Ammo.js ------
  const RBody = initCubeBody({ scale: size, position, quaternion, mass })
  physicsUniverse.addRigidBody(RBody);

  newcube.userData.physicsBody = RBody;
}
function createFloor() {
  const size = 1000
  const position = { x: 0, y: floor, z: 0 }
  const scale = [size, 0, size]
  // three element
  const floorElement = initThreeCube({
    scale: scale,
    position,
    color: 0Xdddddd
  })
  scene.add(floorElement);
  // light
  var directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
  directionalLight.position.set(-1, 0.9, 0.4);
  floorElement.add(directionalLight);

  // ------ Physics Universe - Ammo.js ------
  const RBody = initCubeBody({ scale, position, mass: 0 })
  physicsUniverse.addRigidBody(RBody);
  floorElement.userData.physicsBody = RBody;

  floorElement.name = 'FLOOR'

  // rigidBody_List.push(newcube);

}
// ==================================================================
// ==================================================================
// ==                SPHERE              ===============================================
/** Return a sphere mesh
 * Default color is random
*/
function initThreeSphere({ scale, segments, position, color }: any): Mesh {
  let myColor = color || Math.random() * 0xffffff
  const _segments = segments || 32

  let mySphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(scale, _segments, _segments),
    new THREE.MeshPhongMaterial({
      color: myColor
    }));

  mySphere.position.set(position.x, position.y, position.z);

  return mySphere
}
function createSphere({ scale, position, mass, rot_quaternion, segments }: any) {
  const quaternion = rot_quaternion || { x: 0, y: 0, z: 0, w: 1 };

  // ------ Graphics Universe - Three.JS ------
  const newSphere = initThreeSphere({ scale, position, segments })
  scene.add(newSphere);

  // ------ Physics Universe - Ammo.js ------
  let transform = new Ammo.btTransform();
  transform.setIdentity();
  transform.setOrigin(new Ammo.btVector3(position.x, position.y, position.z));
  transform.setRotation(new Ammo.btQuaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w));
  let defaultMotionState = new Ammo.btDefaultMotionState(transform);
  let structColShape = new Ammo.btSphereShape(scale);
  structColShape.setMargin(0.05);
  let localInertia = new Ammo.btVector3(0, 0, 0);
  structColShape.calculateLocalInertia(mass, localInertia);
  let RBody_Info = new Ammo.btRigidBodyConstructionInfo(mass, defaultMotionState, structColShape, localInertia);
  let RBody = new Ammo.btRigidBody(RBody_Info);

  physicsUniverse.addRigidBody(RBody);
  newSphere.userData.physicsBody = RBody;
  rigidBody_List.push(newSphere);

}
// ==================================================================
// ==================================================================
function updatePhysicsUniverse(deltaTime: number) {
  physicsUniverse.stepSimulation(deltaTime, 10);

  for (let i = 0; i < rigidBody_List.length; i++) {
    const element = rigidBody_List[i];

    const Physics_Obj = element.userData.physicsBody;
    const motionState = Physics_Obj.getMotionState();
    // disable transformation for FLOOR
    if (motionState && element.name !== "FLOOR") {
      motionState.getWorldTransform(tmpTransformation);
      let new_pos = tmpTransformation.getOrigin();
      let new_qua = tmpTransformation.getRotation();
      element.position.set(new_pos.x(), new_pos.y(), new_pos.z());
      element.quaternion.set(new_qua.x(), new_qua.y(), new_qua.z(), new_qua.w());
    }
  }

}

function render() {
  let deltaTime: number = clock.getDelta();
  updatePhysicsUniverse(deltaTime);

  controls.update();

  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

function v3(x: number, y: number, z: number) {
  return new THREE.Vector3(x, y, z)
}
</script>

<template>
  <!-- <main></main> -->
</template>
