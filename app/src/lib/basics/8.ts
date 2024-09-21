
export default ({THREE, OrbitControls, canvas}: any) => {// Sizes

const SIZES = {
    width: window.innerWidth * 0.75,
    height: window.innerHeight * 0.75
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
    // Cube
const CUBE1 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color: 0xff0066, wireframe: true})
)
GROUP.add(CUBE1);

    // Triangle
// const POSITIONS_ARRAY = new Float32Array([
//     0,0,0,
//     0,1,0,
//     1,0,0
// ]);

// const POSITIONS_ATTRIBUTE = new THREE.BufferAttribute(POSITIONS_ARRAY,3);

// // POSITIONS_ARRAY.fill(0); IF GIVEN NUMBER LENGTH TO FLOAT32ARRAY
// // POSITIONS_ARRAY[4] = 1;
// // POSITIONS_ARRAY[6] = 1;

// const GEOMETRY = new THREE.BufferGeometry();
// GEOMETRY.setAttribute("position", POSITIONS_ATTRIBUTE);


// const MATERIAL = new THREE.MeshBasicMaterial({color: 0xff6666, wireframe: true})

// const TRIANGLE = new THREE.Mesh(GEOMETRY, MATERIAL);
// TRIANGLE.position.y = 2;
// GROUP.add(TRIANGLE);

    // Triangles
const TRIANGLES_NUMBER = 9;    
const VERTEX_NUMBER = 3;
const VERTEX_POSITIONS = 3;
const TRIANGLES_POSITIONS_NUMBER = TRIANGLES_NUMBER * VERTEX_NUMBER * VERTEX_POSITIONS;
const TRIANGLES_POSITIONS_ARRAY = new Float32Array(TRIANGLES_POSITIONS_NUMBER);
TRIANGLES_POSITIONS_ARRAY.fill(0);
for(let index = 4, step = 0, i = 0; index < TRIANGLES_POSITIONS_NUMBER - 1; index += step, i++) {
    TRIANGLES_POSITIONS_ARRAY[index] = Math.random()*4 + i;
    step = step === 2? 7 : 2;
}
console.log(TRIANGLES_POSITIONS_ARRAY);
const TRIANGLES_POSITIONS_ATTRIBUTE = new THREE.BufferAttribute(TRIANGLES_POSITIONS_ARRAY,3);
const GEOMETRY = new THREE.BufferGeometry();
GEOMETRY.setAttribute("position", TRIANGLES_POSITIONS_ATTRIBUTE);
const MATERIAL = new THREE.MeshBasicMaterial({color: 0xff6622, wireframe: true})
const TRIANGLE = new THREE.Mesh(GEOMETRY, MATERIAL);
TRIANGLE.position.y = 2;

GROUP.add(TRIANGLE);
// Aggregate
SCENE.add(GROUP);

// Camera
const ASPECT_RATIO = SIZES.width / SIZES.height
const CAMERA = new THREE.PerspectiveCamera(75, ASPECT_RATIO, 1, 100);

CAMERA.position.set(0, 0, 25);
CAMERA.lookAt(GROUP.position)
// Aggregate +
SCENE.add(CAMERA);

// Renderer


const RENDERER = new THREE.WebGLRenderer({canvas});
RENDERER.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // avoid pixel ratios above 2 ( or 3) due to over rendering
RENDERER.setSize(SIZES.width, SIZES.height);

// OrbitControl
const CONTROL = new OrbitControls(CAMERA, canvas);
CONTROL.enableDamping = true;


const tick = () => {
    
    // GROUP.rotation.x += 0.01;
    CONTROL.update();
    RENDERER.render(SCENE, CAMERA);
    window.requestAnimationFrame(tick);
}

tick();
}