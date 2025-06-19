import * as THREE from "three";
import { OrbitControls, RGBELoader } from "three/examples/jsm/Addons.js";

// Canvas
const canvas = document.querySelector("canvas.webgl");
const sizes = { width: window.innerWidth, height: window.innerHeight };
// Scene
const scene = new THREE.Scene();
// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 0, 0);
scene.add(camera);
// DeviceOrientationControlsasdasdasd
window.addEventListener("click", () => {
  requestPermission();
});
const orbitControls = new OrbitControls(camera, canvas);
orbitControls.target.x = 3.5;

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
  orbitControls.update();
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
let gyroscope = new Gyroscope({ frequency: 60 });

gyroscope.addEventListener("reading", (e) => {
  alert(`Angular velocity along the X-axis ${gyroscope.x}`);
});
gyroscope.start();
