import * as THREE from "https://esm.sh/three@0.160.0";
import { GLTFLoader } from "https://esm.sh/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";

const height = window.innerHeight;
const width = window.innerWidth;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75, width / height, 0.1, 1000
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

camera.position.x = 0;
camera.position.z = 10;

const light = new THREE.PointLight(0xffffff, 1)
light.position.set(1, 1, 3);
scene.add(light)

const spot = new THREE.SpotLight(0xffffff,2);
spot.position.set(0,6,4)
spot.angle = Math.PI/6
spot.penumbra - 0.4;
spot.decay = 1
spot.distance = 50;
scene.add(spot)

const ambient = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambient)

const loader = new GLTFLoader();
loader.load(
    "./cupcake.gltf",
    (gltf) => {
        const cupcake = gltf.scene;
        scene.add(cupcake);
        console.log("GLTF Loaded:", cupcake)
    },
    (progress) => console.log((progress.loaded / progress.total) * 100 + "%loaded"),
    (error) => console.error("Error Loading GLTF: ", error)
);

function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
}
animate();

window.addEventListener("resize", () => {
    camera.aspect = width / height
    camera.updateProjectionMatrix();
    renderer.setSize(width, height)
});