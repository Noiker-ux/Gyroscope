import * as THREE from "three";
import { OrbitControls, RGBELoader } from "three/examples/jsm/Addons.js";
import { requestPermission } from "threejs-gyroscope-controls";
import { GyroscopeControls } from "threejs-gyroscope-controls";
// Canvas
const canvas = document.querySelector("canvas.webgl");
const sizes = { width: window.innerWidth, height: window.innerHeight };
// Scene
const scene = new THREE.Scene();
// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 0, 0);
scene.add(camera);
// Глобальные переменные для хранения ориентации устройства
window.addEventListener("click", () => {
  requestPermission();
});
const orbitControls = new GyroscopeControls(camera, canvas);
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
// Gyrod
let obj = {
  x: 0,
  y: 0,
  z: 0,
};

// Tick
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  camera.rotation.x = obj.x;
  camera.rotation.y = obj.y;
  camera.rotation.z = obj.z;
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
window.addEventListener("deviceorientation", function (event) {
  // Получаем углы наклона
  const alpha = event.alpha || 0;
  // Угол поворота вокруг оси Z (азимут)
  const beta = event.beta || 0;
  // Наклон вперед/назад (ось X)
  const gamma = event.gamma || 0;
  // Крен вправо-влево (ось Y)
  document.getElementById("output").innerHTML =
    `Alpha: ${alpha.toFixed(2)}°<br>` + `Beta: ${beta.toFixed(2)}°<br>` + `Gamma: ${gamma.toFixed(2)}°`;
});
