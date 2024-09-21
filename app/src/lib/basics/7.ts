
export default ({THREE, OrbitControls, canvas}: any) => {// Sizes

const SIZES = {
    width: window.innerWidth*0.75,
    height: window.innerHeight*0.75
}

// Resizing feature
window.addEventListener('resize', () => {
    console.log('Window size has changed.')
    // Scene size update
    SIZES.width = window.innerWidth;
    SIZES.height = window.innerHeight;
    // Camera AR update
    CAMERA.aspect = SIZES.width / SIZES.height;
    CAMERA.updateProjectionMatrix();

    // Renderer
    RENDERER.setSize(SIZES.width, SIZES.height);
    RENDERER.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // avoid pixel ratios above 2 ( or 3) due to over rendering
})

// Full screen support feature
// Note: Safari may not have current support for this native js features and may need custom code to handle fullscreen support
window.addEventListener('dblclick', () => {
    // console.log('Double clicked!');
    document.fullscreenElement ?
        document.exitFullscreen() : canvas.requestFullscreen();
    // HTML_CANVAS.requestFullscreen();
    // console.log('Full Screen Mode on!');
    // if(document.fullscreenElement) {
        // console.log('Full Screen Mode off!');
        // document.exitFullscreen();
    // }    
})

// Scene
const SCENE = new THREE.Scene();

// Objects
    // Group
const GROUP = new THREE.Group();
GROUP.scale.set(1, 1, 1);
GROUP.position.z = -2;
GROUP.rotation.y = 0;
    // Cubes
        // CUBE3 written with previous code
const GEOMETRY = new THREE.BoxGeometry(1,1,1);
const MATERIAL = new THREE.MeshBasicMaterial({color: 0xaf3306});

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
RENDERER.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // avoid pixel ratios above 2 ( or 3) due to over rendering
RENDERER.setSize(SIZES.width, SIZES.height);

// OrbitControl
const CONTROL = new OrbitControls(CAMERA, canvas);
// CONTROL.enabled = false;
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