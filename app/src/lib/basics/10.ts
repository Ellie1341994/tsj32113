// import textures from './static/textures/door/color.jpg'

export default ({THREE, OrbitControls, GUI, gsap, canvas}: any) => {

    // Image
//     // load
// const IMAGE = new Image();
// IMAGE.onload = () => {
//     console.log('Image loaded')
// }
// const TEXTURE = new THREE.Texture(IMAGE);
//     // texture
// IMAGE.addEventListener('load', () => {
//     TEXTURE.needsUpdate = true;
// });
// IMAGE.src = './static/textures/door/color.jpg'
// LoaderManager
const LOADING_MANAGER = new THREE.LoadingManager();
// LOADING_MANAGER.onStart = () => {};
// LOADING_MANAGER.onLoad = () => {};
// LOADING_MANAGER.onProgress = () => () => {};
// LOADING_MANAGER.onError = () => {};

const TEXTURE_LOADER = new THREE.TextureLoader(LOADING_MANAGER);
const lessonAssetsPath = "../../src/lib/basics/assets/10"
const IMG_TEXTURE = false ? "checkerboard-1024x1024.png" : "minecraft.png";
const COLOR_TEXTURE = TEXTURE_LOADER.load(`${lessonAssetsPath}/textures/${IMG_TEXTURE}`);
// COLOR_TEXTURE.minFilter = THREE.NearestFilter;
COLOR_TEXTURE.magFilter = THREE.NearestFilter;
// COLOR_TEXTURE.repeat.set(2,19);
// // COLOR_TEXTURE.wrapT = THREE.RepeatWrapping;
// const ALPHA_TEXTURE = TEXTURE_LOADER.load(`${projectPath}/textures/door/alpha.jpg`);
// const HEIGHT_TEXTURE = TEXTURE_LOADER.load(`${projectPath}/textures/door/height.jpg`);
// const NORMAL_TEXTURE = TEXTURE_LOADER.load(`${projectPath}/textures/door/normal.jpg`);
// const AMBIENT_OCCLUSION_TEXTURE = TEXTURE_LOADER.load(`${projectPath}/textures/door/ambientOcclusion.jpg`);
// const METALNESS_TEXTURE = TEXTURE_LOADER.load(`${projectPath}/textures/door/metalness.jpg`);
// const ROUGHNESS_TEXTURE = TEXTURE_LOADER.load(`${projectPath}/textures/door/roughness.jpg`);

COLOR_TEXTURE.colorSpace = THREE.SRGBColorSpace;
// Debug UI

const G_U_I = new GUI({width: 300, title: "Slider U.I Panel", closeFolders: false,});;
// G_U_I.close();


window.addEventListener("keydown",(event) => {
    event.key === "h" && G_U_I.show(G_U_I._hidden);
})

const debugObject = {color: 0x9a9996, segments: { width: 2}, scale: 0, spin: () => {}}

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
});

// Scene
const SCENE = new THREE.Scene();

// Objects
    // Rinrg
    const RING1 = new THREE.Mesh(
        new THREE.TorusGeometry(1, 0.35,32,100),
        new THREE.MeshBasicMaterial({color: debugObject.color, wireframe: false, map: COLOR_TEXTURE})
    ) 
    RING1.position.set(-1,0,0);
    // Cube
    const CUBE_GEOMETRY = new THREE.BoxGeometry(1,1,1);

    const CUBE1 = new THREE.Mesh(
        CUBE_GEOMETRY,
    new THREE.MeshBasicMaterial({color: debugObject.color, wireframe: false, map: COLOR_TEXTURE})
)
    CUBE1.position.set(1,0,0);

// Aggregate
SCENE.add(CUBE1);
SCENE.add(RING1);

// Gui objects
// const LIMITS = [-25, 25, 1]
const [MIN, MAX, STEP, ALIAS] = [-25, 25, 1, 'Horizontal mov.']
G_U_I.add(CUBE1.position, 'x', MIN, MAX, STEP)
    .name(ALIAS);

G_U_I.add(CUBE1, 'visible');

// Support for whole scale modification
debugObject.scale = 0;
G_U_I.add(debugObject, 'scale', 0,5,0.1).name('Scale all').onChange(() => {
    const VALS = new Array(3).fill(debugObject.scale)
    CUBE1.scale.set(...VALS);
    CUBE1.scale.x = debugObject.scale;
});

G_U_I.add(CUBE1.material, 'wireframe');
// solution that properly matches the color picked in lil-ui and three js internal color managemenr
G_U_I.addColor(debugObject, 'color').onChange(() =>
    {
        CUBE1.material.color.set(debugObject.color)
    })



// Adding segment slider and geometry change (a box with segments)
debugObject.segments = {width: 2};
G_U_I.add(debugObject.segments, 'width').min(1).max(4).step(1).name("Width segments").onFinishChange(() => {
    CUBE1.geometry.dispose(); // it frees memory and avoids leaks from previously instanced entities
    CUBE1.geometry =  new THREE.BoxGeometry(1,1,1,debugObject.segments.width)
});

debugObject.spin = ( ) => {
    gsap.to(CUBE1.rotation, {y: CUBE1.rotation.y + Math.PI * 2})
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

CAMERA.position.set(0, 0, 5);
CAMERA.lookAt(CUBE1.position)
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