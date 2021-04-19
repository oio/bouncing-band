/*
    Bouncer class    
*/

import * as THREE from "three";
import { Howl, Howler } from "howler";
import { spawn } from "./spawner.js";

export class Bouncer {
  constructor(pos, height, thing) {
    const obj = spawn(thing);

    this.mesh = obj.mesh;
    this.mass = obj.mass;
    this.sound = new Howl({
      src: [obj.sound],
    });

    this.mesh.castShadow = true;
    this.mesh.position.copy(pos);

    this.mesh.position.y = height;
    this.bottom = pos.y;
    this.rotationLimit = Math.PI * 4;
    this.hasPlayed = true;

    // position
    this.vel = new THREE.Vector3();
    this.acc = new THREE.Vector3();

    // rotation
    this.dRot = new THREE.Euler(
      Math.random() * this.rotationLimit,
      Math.random() * this.rotationLimit,
      Math.random() * this.rotationLimit
    );
    this.rDamp = obj.rDamp;
  }

  applyForce(force) {
    // newton
    let f = force.clone();
    f.divideScalar(this.mass);
    this.acc.add(f);
  }

  update() {
    //position
    this.vel.add(this.acc);
    this.mesh.position.add(this.vel);
    this.acc.multiplyScalar(0);

    // life is too short
    // to understand quaternions
    const rx = (this.dRot.x - this.mesh.rotation.x) * this.rDamp;
    const ry = (this.dRot.y - this.mesh.rotation.y) * this.rDamp;
    const rz = (this.dRot.z - this.mesh.rotation.z) * this.rDamp;
    this.mesh.rotation.set(
      (this.mesh.rotation.x += rx),
      (this.mesh.rotation.y += ry),
      (this.mesh.rotation.z += rz)
    );

    // not sure about that 0.2                v
    if (this.mesh.position.y < this.bottom + 0.2) {
      if (!this.hasPlayed) this.sound.play();
      this.hasPlayed = true;
    }

    //  bounce
    if (this.mesh.position.y < this.bottom) {
      this.mesh.position.y = this.bottom;
      this.vel.y *= -1;
      this.resetAngle();
      this.hasPlayed = false;
    }
  }

  // i know this sucks
  resetAngle() {
    this.dRot = new THREE.Euler(
      Math.random() * this.rotationLimit,
      Math.random() * this.rotationLimit,
      Math.random() * this.rotationLimit
    );
  }
}
