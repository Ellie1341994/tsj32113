
export default ({THREE, canvas}: any) => {// Scene
const SCENE = new THREE.Scene();

// Axis Helper

const AXES_HELPER = new THREE.AxesHelper(2);

// Objects
    // Group
const GROUP = new THREE.Group();
GROUP.scale.y = 1;
GROUP.rotation.y = 0;
    // Cubes
        // CUBE3 written with previous code
const GEOMETRY = new THREE.BoxGeometry(1,1,1);
const MATERIAL = new THREE.MeshBasicMaterial({color: 0xaf0006});

// Mesh
const MESH = new THREE.Mesh(GEOMETRY, MATERIAL);
MESH.position.x = 1.45;
MESH.position.y = 0;
MESH.position.z = 0;

// Potentially useful prop.
// MESH.position.normalize();

MESH.scale.x = 1;
MESH.scale.y = 1;
MESH.scale.z = 1;

// MESH.rotation.x = Math.PI * 0.25;
MESH.rotation.y = Math.PI * 0.15;
GROUP.add(MESH);

const CUBE2 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color: 0x006669})
)
CUBE2.position.x = 0;
GROUP.add(CUBE2);

const CUBE3 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color: 0xff0066})
)
CUBE3.rotation.y = - Math.PI * 0.15;
CUBE3.position.x = -1.45;
GROUP.add(CUBE3);

// Aggregate
SCENE.add(AXES_HELPER)
SCENE.add(GROUP);

// Sizes

const SIZES = {
    width: 800,
    height: 600
}

// Camera

const CAMERA = new THREE.PerspectiveCamera(75, SIZES.width / SIZES.height);
CAMERA.position.z = 3

// Potentially useful prop.
// CAMERA.lookAt(MESH.position);

// Aggregate +
SCENE.add(CAMERA);

// Renderer
const RENDERER = new THREE.WebGLRenderer({canvas});
RENDERER.setSize(SIZES.width, SIZES.height);

// Render

RENDERER.render(SCENE, CAMERA);}