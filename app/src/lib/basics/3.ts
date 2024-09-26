export default ({THREE, canvas}: any) => {
 // Scene
const SCENE = new THREE.Scene();

// Objects

// const sphereGeometry = new THREE.SphereGeometry(1.5,32,32);

const GEOMETRY = new THREE.BoxGeometry(1,1,1);

const MATERIAL = new THREE.MeshBasicMaterial({color: 0xff0000});

// Mesh
const MESH = new THREE.Mesh(GEOMETRY, MATERIAL);

// Aggregate

SCENE.add(MESH);

// Sizes

const SIZES = {
    width: 800,
    height: 600
}

// Camera

const CAMERA = new THREE.PerspectiveCamera(75, SIZES.width / SIZES.height);
CAMERA.position.z = 3

// Aggregate +
SCENE.add(CAMERA);

// Renderer

const RENDERER = new THREE.WebGLRenderer({canvas});
RENDERER.setSize(SIZES.width, SIZES.height);

// Render

RENDERER.render(SCENE, CAMERA);
// console.log("renderer info",RENDERER.info)
}