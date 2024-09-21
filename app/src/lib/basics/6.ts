
export default ({THREE, OrbitControls, canvas}: any) => {// Sizes

const SIZES = {
    width: 800,
    height: 600
}

/*
    Cursor
*/
const CURSOR = {x: 0, y: 0};
window.addEventListener('mousemove', (event) => {
    CURSOR.x = event.clientX / SIZES.width - 0.5;
    CURSOR.y = event.clientY / SIZES.height - 0.5;
    console.log(`x:${CURSOR.x} y:${CURSOR.y}`);
})

// Scene
const SCENE = new THREE.Scene();

// Objects
    // Group
const GROUP = new THREE.Group();
GROUP.scale.set(1, 1, 1);
GROUP.rotation.y = 0;
    // Cubes
        // CUBE3 written with previous code
const GEOMETRY = new THREE.BoxGeometry(1,1,1);
const MATERIAL = new THREE.MeshBasicMaterial({color: 0xaf6606});

// Mesh
const MESH = new THREE.Mesh(GEOMETRY, MATERIAL);
MESH.position.x = 1.45;
MESH.position.y = 0;
MESH.position.z = 0;


// MESH.rotation.x = Math.PI * 0.25;
// MESH.rotation.y = Math.PI * 0.15;
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

CUBE3.position.x = -1.45;
GROUP.add(CUBE3);

// Aggregate
// SCENE.add(AXES_HELPER)
SCENE.add(GROUP);

// Camera
const ASPECT_RATIO = SIZES.width / SIZES.height
const CAMERA = new THREE.PerspectiveCamera(75, ASPECT_RATIO, 1, 100);



// const CAMERA = new THREE.OrthographicCamera(
//     -1 * ASPECT_RATIO,
//     1 * ASPECT_RATIO, 1,
//     -1,
//     0.1,
//     99);
CAMERA.position.set(0, 0, 3);
CAMERA.lookAt(GROUP.position)
// Aggregate +
SCENE.add(CAMERA);

// Renderer
const RENDERER = new THREE.WebGLRenderer({canvas});
RENDERER.setSize(SIZES.width, SIZES.height);

// OrbitControl
const CONTROL = new OrbitControls(CAMERA, canvas);
CONTROL.enableDamping = true;
// CONTROL.target.y = -1;

// Object rotation using the mouse
// const tick = () => {
    
//     GROUP.rotation.x += 0.01;
//     CAMERA.position.set(
//         Math.sin(CURSOR.x * Math.PI * 2) * 3,
//         CURSOR.y * 4,
//         Math.cos(CURSOR.x * Math.PI * 2)  * 3
//     );
//     CAMERA.lookAt(GROUP.position);
//     RENDERER.render(SCENE, CAMERA);
//     window.requestAnimationFrame(tick);
// }

// tick();

const tick = () => {
    
    GROUP.rotation.x += 0.01;
    CONTROL.update();
    RENDERER.render(SCENE, CAMERA);
    window.requestAnimationFrame(tick);
}

tick();
}