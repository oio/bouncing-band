/*

      __
  ___( o)>  quack
  \ <_. )
   `---'   

██████   ██████  ██    ██ ███    ██  ██████ ██ ███    ██  ██████  
██   ██ ██    ██ ██    ██ ████   ██ ██      ██ ████   ██ ██       
██████  ██    ██ ██    ██ ██ ██  ██ ██      ██ ██ ██  ██ ██   ███ 
██   ██ ██    ██ ██    ██ ██  ██ ██ ██      ██ ██  ██ ██ ██    ██ 
██████   ██████   ██████  ██   ████  ██████ ██ ██   ████  ██████             
                                                                  
██████   █████  ███    ██ ██████  
██   ██ ██   ██ ████   ██ ██   ██ 
██████  ███████ ██ ██  ██ ██   ██ 
██   ██ ██   ██ ██  ██ ██ ██   ██ 
██████  ██   ██ ██   ████ ██████  
                                                                          
🌐 https://oio.studio
👩🏻‍💻 https://github.com/oio/bouncing-band

*/

import * as THREE from "three";
import { ARButton } from "./lib/ARButton.js";
import { Howl, Howler } from "howler";
import { Bouncer } from "./lib/Bouncer.js";
import { preload, loadMesh, glbSrc } from "./lib/spawner.js";

// media assets
import iconFiles from "./media/2d/icons/*.png";
import soundFiles from "./media/sounds/*.mp3";

// gif
import explosionGifSrc from "./media/2d/gif/explosion.gif";

// preload sounds
let sounds = {};
sounds.explosion = new Howl({ src: [soundFiles.explosion] });
sounds.undo = new Howl({ src: [soundFiles.undo] });
sounds.click = new Howl({ src: [soundFiles.click] });
sounds.cluck = new Howl({ src: [soundFiles.cluck] });

// convert icons to array
const iconSRC = Object.keys(iconFiles).map(function (key) {
  return iconFiles[key];
});

let icons = [];
let deviceRotation = { x: 0, y: 0, z: 0 };

// preload images
iconSRC.map((src) => {
  const img = new Image();
  img.src = src;
  icons.push(img);
});

// load random icon
let iconIndex = Math.floor(Math.random() * icons.length);
let icon = icons[iconIndex].src;

// init three js
let container;
let camera, scene, renderer;
let controller;
let reticle, pointer;

let hitTestSource = null;
let hitTestSourceRequested = false;

let isUI = false;
let isTracked = false;
let isStarted = false;
let floater = null;
let bouncers = [];

// set gravity
const gravity = new THREE.Vector3(0, -0.01, 0);

const init = () => {
  container = document.createElement("div");
  document.body.appendChild(container);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.01,
    20
  );

  const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1.5);
  light.position.set(0.5, 1, 1);
  scene.add(light);

  //

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
  container.appendChild(renderer.domElement);

  //

  document.body.appendChild(
    ARButton.createButton(renderer, {
      requiredFeatures: ["hit-test"],
      optionalFeatures: ["dom-overlay"],
      domOverlay: { root: document.getElementById("overlay") },
    })
  );

  //

  window.addEventListener("deviceorientation", handleOrientation, true);

  //

  const onSelect = () => {
    // UI Acrobatics
    if (isUI) {
      isUI = false;
    } else {
      if (reticle.visible) {
        const height = new THREE.Vector3().setFromMatrixPosition(
          camera.matrixWorld
        ).y;
        const pos = new THREE.Vector3().setFromMatrixPosition(reticle.matrix);
        const thing = icon.split("/")[3].split(".")[0];

        let bouncer = new Bouncer(pos, height, thing);

        scene.add(bouncer.mesh);
        bouncers.push(bouncer);

        const nav = document.querySelector("nav");
        if (nav.classList.contains("hidden")) nav.classList.remove("hidden");
      }
    }
  };

  controller = renderer.xr.getController(0);
  controller.addEventListener("select", onSelect);
  scene.add(controller);

  reticle = new THREE.Mesh(
    new THREE.RingBufferGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial()
  );
  reticle.matrixAutoUpdate = false;
  reticle.visible = false;

  pointer = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.02),
    new THREE.MeshLambertMaterial({ color: 0xcccccc })
  );
  pointer.visible = false;

  scene.add(pointer);
  scene.add(reticle);

  //

  window.addEventListener("resize", onWindowResize, false);

  // start with random icon
  document.querySelector(".icon").setAttribute("src", icon);

  // splash screen
  loadMesh(glbSrc.duck).then((mesh) => {
    scene.background = new THREE.Color(0x000000);
    floater = mesh.clone();
    floater.scale.copy(new THREE.Vector3(0.03, 0.03, 0.03));
    floater.rotation.set(0, 0, 0);
    //Y↑ X→ Z↙
    floater.position.set(0, -0.7, -0.7);
    camera.lookAt(floater.position);
    scene.add(floater);
    camera.position.set(0, -0.38, 0);

    //hide loader
    document.querySelector(".cool-stuff").classList.remove("hidden");
    document.querySelector(".loader").classList.add("hidden");
    document.querySelector("#ARButton").style.visibility = "visible";
  });

  preload().then(() => {
    console.log("models loaded!");
  });
};
// end of init

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

const bomb = () => {
  isUI = true;
  sounds.explosion.play();
  let explGif = new Image();

  // cheap trick to start the gif loop from scratch
  // i tried reloading the src
  // doesn't work
  explGif.src = explosionGifSrc + "?a=" + Math.random();

  let gif = document.createElement("img");
  gif.setAttribute("src", explGif.src);
  document.querySelector(".gifcontainer").appendChild(gif);

  // it's rude to be late
  window.setTimeout(() => {
    bouncers.map((ball) => {
      scene.remove(ball.mesh);
    });
    bouncers = [];
    renderer.renderLists.dispose();
    document.querySelector("nav").classList.add("hidden");
    window.navigator.vibrate(1000);
  }, 400);

  // timing acrobatics
  window.setTimeout(() => {
    document.querySelector(".gifcontainer").innerHTML = "";
  }, 1200);
};

const undo = () => {
  if (bouncers.length > 0) {
    window.setTimeout(() => {
      window.navigator.vibrate(40);
    }, 200);
    let ball = bouncers[bouncers.length - 1];
    scene.remove(ball.mesh);
    bouncers.pop();
    isUI = true;
    sounds.undo.play();
  }

  // hide ui
  if (bouncers.length === 0) {
    document.querySelector("nav").classList.add("hidden");
  }
};

const nextIcon = () => {
  iconIndex++;
  sounds.click.play();
  updateIcon();
};

const prevIcon = () => {
  iconIndex--;
  sounds.cluck.play();
  updateIcon();
};

const updateIcon = () => {
  isUI = true;
  const i = Math.abs(iconIndex % icons.length);
  icon = icons[i].src;
  document.querySelector(".icon").setAttribute("src", icon);
  window.navigator.vibrate(40);
};

const toggleHints = () => {
  const hints = document.querySelector(".hints");
  const bottom = document.querySelector(".bottom");
  const nav = document.querySelector("nav");

  if (hints.classList.contains("hidden")) {
    hints.classList.remove("hidden");
    bottom.classList.add("hidden");
    nav.classList.add("hidden");
  } else {
    if (bouncers.length > 0) nav.classList.remove("hidden");
    hints.classList.add("hidden");
    bottom.classList.remove("hidden");
  }
};

const handleOrientation = (event) => {
  var absolute = event.absolute;
  var alpha = event.alpha;
  var beta = event.beta;
  var gamma = event.gamma;

  deviceRotation.x = beta;
  deviceRotation.y = gamma;
  deviceRotation.z = alpha;
};

function animate() {
  renderer.setAnimationLoop(render);
}

function render(timestamp, frame) {
  if (!isStarted) {
    if (floater !== null)
      floater.rotation.set(
        deviceRotation.x * 0.02 - 45,
        (floater.rotation.y += 0.015),
        0
      );
  } else {
    if (floater !== null) {
      scene.remove(floater);
      camera.position.set(0, 0, 0);
      floater = null;
      window.removeEventListener("deviceorientation", handleOrientation, true);
    }
    if (frame) {
      const referenceSpace = renderer.xr.getReferenceSpace();
      const session = renderer.xr.getSession();

      if (hitTestSourceRequested === false) {
        session.requestReferenceSpace("viewer").then(function (referenceSpace) {
          session
            .requestHitTestSource({ space: referenceSpace })
            .then(function (source) {
              hitTestSource = source;
            });
        });

        session.addEventListener("end", function () {
          hitTestSourceRequested = false;
          hitTestSource = null;
        });

        hitTestSourceRequested = true;
      }

      if (hitTestSource) {
        const hitTestResults = frame.getHitTestResults(hitTestSource);
        if (hitTestResults.length) {
          const hit = hitTestResults[0];
          reticle.visible = true;
          pointer.visible = true;
          reticle.matrix.fromArray(
            hit.getPose(referenceSpace).transform.matrix
          );
          const reticlePos = new THREE.Vector3().setFromMatrixPosition(
            reticle.matrix
          );
          const cameraPos = new THREE.Vector3().setFromMatrixPosition(
            camera.matrixWorld
          );

          pointer.position.copy(reticlePos);
          pointer.position.y = cameraPos.y;

          if (!isTracked) {
            isTracked = true;
            toggleHints();
            document.querySelector(".subhint").classList.remove("hidden");
            window.setTimeout(() => {
              document.querySelector(".subhint").remove();
            }, 8000);
          }
        } else {
          reticle.visible = false;
          pointer.visible = false;
        }
      }
    }

    // update bouncers
    for (let i = 0; i < bouncers.length; i++) {
      bouncers[i].applyForce(gravity);
      bouncers[i].update();
    }
  }

  renderer.render(scene, camera);
}

//RUN! 🏃🏻‍♂️

init();

renderer.xr.addEventListener("sessionstart", function (event) {
  document.querySelector("#overlay").classList.remove("hidden");
  scene.background = null;
  isStarted = true;
  document.querySelector("#splash").remove();
  console.log("scene started");
});

document.querySelector(".undo").onclick = undo;
document.querySelector(".bomb").onclick = bomb;
document.querySelector(".next").onclick = nextIcon;
document.querySelector(".prev").onclick = prevIcon;

// gg
animate();
