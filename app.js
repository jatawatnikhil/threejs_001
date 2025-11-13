import * as THREE from "https://esm.sh/three@0.160.0";
import { GLTFLoader } from "https://esm.sh/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";
import { DirectionalLightHelper, PointLightHelper, SpotLightHelper } from "https://esm.sh/three@0.160.0";
import { OrbitControls } from "https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";

const container = document.getElementById('container')
const width = container.clientWidth;
const height = container.clientHeight;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75, width / height, 0.1, 1000
);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(width, height);
renderer.setClearColor(0x000000, 0)
container.appendChild(renderer.domElement);

camera.position.x = 5;
camera.position.y = 0;
camera.position.z = 6;

const ambient = new THREE.AmbientLight(0xffffff, 0.6)
scene.add(ambient)

const light = new THREE.PointLight(0xffff00, 1)
light.position.set(-3, 3, 3);
scene.add(light)

const dirLight = new THREE.DirectionalLight(0xffffff, 2);
dirLight.position.set(5,1,4);
dirLight.castShadow = true;
scene.add(dirLight);

const spot = new THREE.SpotLight(0xff0000, 2);
spot.position.set(3,5,4);
spot.angle = Math.PI/6;
scene.add(spot);

const spotHelper = new SpotLightHelper(spot);
const dirHelper = new DirectionalLightHelper(dirLight, 2, 0xffffff)
const ptHelper = new PointLightHelper(light, 2, 0xffffff)
// scene.add(ptHelper)
// scene.add(dirHelper)
// scene.add(spotHelper)

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.autoRotate = false;
controls.autoRotateSpeed = 1.0;
controls.minPolarAngle = Math.PI/2;
controls.maxPolarAngle = Math.PI/2;

const debug = document.createElement('div');
debug.classList.add("debug");
document.body.appendChild(debug);

controls.addEventListener('change', ()=>{
    debug.textContent = `
    x: ${camera.position.x.toFixed(2)}
    y: ${camera.position.y.toFixed(2)}
    z: ${camera.position.z.toFixed(2)}
    `
})


let cupcake;
const loader = new GLTFLoader();
loader.load(
    "./cupcake.gltf",
    (gltf) => {
        cupcake = gltf.scene;
        scene.add(cupcake);
        console.log("GLTF Loaded:", cupcake)
    },
    (progress) => console.log((progress.loaded / progress.total) * 100 + "%loaded"),
    (error) => console.error("Error Loading GLTF: ", error)
);

let speed = 0.01;
window.addEventListener('mousemove', (e)=>{
    const ratio = e.clientX / window.innerWidth;
    speed = (ratio - 0.5) * 0.05
})

function animate() {
    requestAnimationFrame(animate)
    controls.update()
    if(spotHelper) spotHelper.update();
    renderer.render(scene, camera)
}
animate();

window.addEventListener("resize", () => {
    camera.aspect = width / height
    camera.updateProjectionMatrix();
    renderer.setSize(width, height)
});