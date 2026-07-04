import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { ARButton } from "three/addons/webxr/ARButton.js";

let scene, camera, renderer, controls;

scene = new THREE.Scene();

camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.01,
  100
);

renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;

document.body.appendChild(renderer.domElement);

// PC controls
controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 0.2, 0.5);

controls.enableDamping = true;
controls.target.set(0, 0.05, 0);
controls.update();

// Lights
const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 2);
scene.add(light);

// AR Button
const arButton = ARButton.createButton(renderer);
arButton.style.display = "none";
document.body.appendChild(arButton);

document.getElementById("enter-ar").onclick = () => {
  arButton.click();
};

// Load Burger
const loader = new GLTFLoader();

loader.load("./zinger_burger.glb", (gltf) => {
  const burger = gltf.scene;

  burger.scale.set(1, 1, 1);
  scene.add(burger);

  addLabel("⭐ 4.6", 0.18, 0.15);
  addLabel("₹249", 0.18, 0.09);
  addLabel("650 Cal", 0.18, 0.03);

  function addLabel(text, x, y) {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 128;

    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 512, 128);

    ctx.fillStyle = "black";
    ctx.font = "48px Arial";
    ctx.fillText(text, 20, 80);

    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.SpriteMaterial({
      map: texture
    });

    const sprite = new THREE.Sprite(material);

    sprite.scale.set(0.2, 0.05, 1);
    sprite.position.set(x, y, 0);

    burger.add(sprite);
  }
});

// Animation loop
renderer.setAnimationLoop(() => {
  controls.update();
  renderer.render(scene, camera);
});

// Resize
window.addEventListener("resize", () => {
  camera.aspect =
    window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );
});