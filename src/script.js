import * as THREE from "three";
import { Gyroscope } from "three/examples/jsm/Addons.js";
import { RGBELoader } from "three/examples/jsm/Addons.js";

// Canvas
const canvas = document.querySelector("canvas.webgl");
const sizes = { width: window.innerWidth, height: window.innerHeight };
// Scene
const scene = new THREE.Scene();
// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 0, 0);
scene.add(camera);
// DeviceOrientationControls
const gyroscope = new Gyroscope();
let alpha = 0,
  beta = 0,
  gamma = 0;
function updateCamera() {
  const q = new THREE.Quaternion().setFromEuler(
    new THREE.Euler((beta * Math.PI) / 180, (alpha * Math.PI) / 180, (gamma * Math.PI) / 180)
  );
  camera.quaternion.copy(q);
}

if (typeof window.ondeviceorientation !== undefined) {
  window.addEventListener(
    "deviceorientation",
    function (event) {
      if (!event.alpha && !event.beta && !event.gamma) return;
      alpha = event.alpha ? event.alpha : 0;
      beta = event.beta ? event.beta : 0;
      gamma = event.gamma ? event.gamma : 0;
      updateCamera();
    },
    false
  );
}

// Loaders
const rgbeLoader = new RGBELoader();
// Textures
rgbeLoader.load("/sunset_jhbcentral_4k.hdr", (envMap) => {
  envMap.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = envMap;
  scene.background = envMap;
});
// Renderer
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// Clock
const clock = new THREE.Clock();
// Tick
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  updateCamera();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();
// Resize
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
// Глобальные переменные для хранения ориентации устройства
