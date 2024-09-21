export default ({THREE, OrbitControls, gsap, GUI, canvas}: any) => {

// Debug UI
const G_U_I = new GUI({width: 300, title: "Slider U.I Panel", closeFolders: false, container: canvas.parentElement,});;
G_U_I.close();


window.addEventListener("keydown",(event) => {
    event.key === "h" && G_U_I.show(G_U_I._hidden);
})

const debugObject = {color: 0x006633, segments: {width: 2}, spin: () => {}}

// Sizes

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
window.addEventListener('dblclick', () => {
    document.fullscreenElement ?
        document.exitFullscreen() : canvas.requestFullscreen();  
})

// Scene
const SCENE = new THREE.Scene();

// Objects
    // Group
const GROUP = new THREE.Group();
GROUP.scale.set(1, 1, 1);
GROUP.position.z = 0;
GROUP.rotation.y = 0;
    // Cube
const CUBE1 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color: debugObject.color, wireframe: true})
)
// GROUP.add(CUBE1);

    // Triangles
const TRIANGLES_NUMBER = 9;    
const VERTEX_NUMBER = 3;
const VERTEX_POSITIONS = 3;
const TRIANGLES_POSITIONS_NUMBER = TRIANGLES_NUMBER * VERTEX_NUMBER * VERTEX_POSITIONS;
const TRIANGLES_POSITIONS_ARRAY = new Float32Array(TRIANGLES_POSITIONS_NUMBER);
// TRIANGLES_POSITIONS_ARRAY.fill(0);
for(let  index = 0, i = 0; index < TRIANGLES_POSITIONS_NUMBER - 1; index++) {
    TRIANGLES_POSITIONS_ARRAY[index] = index < 3 || index % 9 < 3 ? 
        index / 2 : Math.random() * index;
}
console.log(TRIANGLES_POSITIONS_ARRAY);
const TRIANGLES_POSITIONS_ATTRIBUTE = new THREE.BufferAttribute(TRIANGLES_POSITIONS_ARRAY,3);
const GEOMETRY = new THREE.BufferGeometry();
GEOMETRY.setAttribute("position", TRIANGLES_POSITIONS_ATTRIBUTE);
const MATERIAL = new THREE.MeshBasicMaterial({color: 0xff6622, wireframe: true})
const TRIANGLES = new THREE.Mesh(GEOMETRY, MATERIAL);
// TRIANGLE.position.y = 2;

GROUP.add(TRIANGLES);
// Aggregate
SCENE.add(GROUP);

// Gui objects
// const LIMITS = [-25, 25, 1]
const [MIN, MAX, STEP, ALIAS] = [-25, 25, 1, 'Horizontal mov.']
G_U_I.add(TRIANGLES.position, 'x', MIN, MAX, STEP)
//  Alternative
//  .min(-25) 
//  .max(25)
//  .step(1)
    .name(ALIAS);

G_U_I.add(TRIANGLES, 'visible');
G_U_I.add(GROUP.scale, 'x', 'scale', 0.1,5,0.5).name('scale');
G_U_I.add(MATERIAL, 'wireframe');
// solution that properly matches the color picked in lil-ui and three js internal color managemenr
G_U_I.addColor(debugObject, 'color').onChange(() =>
    {
        MATERIAL.color.set(debugObject.color)
    })



// Adding segment slider and geometry change (a box with segments)
debugObject.segments = {width: 2};
G_U_I.add(debugObject.segments, 'width').min(1).max(4).step(1).onFinishChange(() => {
    TRIANGLES.geometry.dispose(); // it frees memory and avoids leaks from previously instanced entities
    TRIANGLES.geometry =  new THREE.BoxGeometry(1,1,1,debugObject.segments.width)
});

debugObject.spin = ( ) => {
    gsap.to(TRIANGLES.rotation, {y: TRIANGLES.rotation.y + Math.PI * 2})
};
// simple button click spin animation on the gui
// G_U_I.add(debugObject, 'spin');
// GUI Folder code for organization
const MESH_TWEAKS = G_U_I.addFolder('Animation Folder');
MESH_TWEAKS.add(debugObject, 'spin')
MESH_TWEAKS.close();
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