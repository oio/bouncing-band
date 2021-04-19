import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import sounds from "../media/sounds/*.mp3";
import glbs from "../media/3d/*.glb";

let models = {};

export let glbSrc = glbs;

export const preload = async () => {
  models.hotdog = await loadMesh(glbs.hotdog);
  models.duck = await loadMesh(glbs.duck);
  models.paddle = await loadMesh(glbs.paddle);
  models.hammer = await loadMesh(glbs.hammer);
  models.moka = await loadMesh(glbs.moka);
  models.broccoli = await loadMesh(glbs.broccoli);
  models.laser = await loadMesh(glbs.laser);
};

export let loadMesh = async (url) => {
  const gltf = await modelLoader(url);
  return gltf.scene.children[0];
};

const loader = new GLTFLoader();

// this utility function allows you to use any three.js
// loader with promises and async/await
const modelLoader = (url) => {
  return new Promise((resolve, reject) => {
    loader.load(url, (data) => resolve(data), null, reject);
  });
};

export const spawn = (thing) => {
  let obj = {};

  if (thing === "hotdog") {
    let hotdog = models.hotdog.clone();
    hotdog.rotation.set(0, Math.random() * 10, 0);
    obj.mesh = hotdog;
    obj.sound = sounds.squelch;
    obj.mass = 2;
    obj.rDamp = 0.01 + Math.random() * 0.03;
  }

  if (thing === "pong") {
    if (Math.random() > 0.05) {
      const g = new THREE.SphereBufferGeometry(0.05, 16, 16);
      const m = new THREE.MeshLambertMaterial({ color: 0xcccccc });
      obj.mesh = new THREE.Mesh(g, m);
      obj.rDamp = 0;
    } else {
      // spawn super secret oio bonus paddle
      let paddle = models.paddle.clone();
      paddle.rotation.set(0, Math.random() * 10, 0);
      obj.mesh = paddle;
      obj.rDamp = 0.01 + Math.random() * 0.01;
    }
    obj.sound = sounds.pong;
    obj.mass = 1;
  }

  if (thing === "duck") {
    let duck = models.duck.clone();
    duck.rotation.set(0, Math.random() * 10, 0);
    obj.mesh = duck;
    obj.sound = sounds.quack;
    obj.mass = 1;
    obj.rDamp = 0.01 + Math.random() * 0.03;
  }

  if (thing === "moka") {
    let moka = models.moka.clone();
    moka.rotation.set(0, Math.random() * 10, 0);
    obj.mesh = moka;
    obj.sound = sounds.bling;
    obj.mass = 3;
    obj.rDamp = 0.01 + Math.random() * 0.02;
  }

  if (thing === "hammer") {
    let hammer = models.hammer.clone();
    hammer.rotation.set(0, Math.random() * 10, 0);
    obj.mesh = hammer;
    obj.sound = sounds.kick;
    obj.mass = 3;
    obj.rDamp = 0.01 + Math.random() * 0.02;
  }

  if (thing === "broccoli") {
    let broccoli = models.broccoli.clone();
    broccoli.rotation.set(0, Math.random() * 10, 0);
    obj.mesh = broccoli;
    obj.sound = sounds.snare;
    obj.mass = 3;
    obj.rDamp = 0.01 + Math.random() * 0.03;
  }

  if (thing === "laser") {
    let laser = models.laser.clone();
    laser.rotation.set(0, Math.random() * 10, 0);
    obj.mesh = laser;
    obj.sound = sounds.laser;
    obj.mass = 3;
    obj.rDamp = 0.01 + Math.random() * 0.03;
  }

  return obj;
};
