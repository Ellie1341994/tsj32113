export default ({THREE, OrbitControls, RGBELoader, GUI, gsap, canvas}: any) => {
const LOADING_MANAGER = new THREE.LoadingManager();

const TEXTURE_LOADER = new THREE.TextureLoader(LOADING_MANAGER);
const lessonAssetsPath = "../../src/lib/basics/assets/11/textures"
const COLOR_TEXTURE = TEXTURE_LOADER.load(`${lessonAssetsPath}/door/color.jpg`);
const ALPHA_TEXTURE = TEXTURE_LOADER.load(`${lessonAssetsPath}/door/alpha.jpg`);
const HEIGHT_TEXTURE = TEXTURE_LOADER.load(`${lessonAssetsPath}/door/height.jpg`);
const NORMAL_TEXTURE = TEXTURE_LOADER.load(`${lessonAssetsPath}/door/normal.jpg`);
const AMBIENT_OCCLUSION_TEXTURE = TEXTURE_LOADER.load(`${lessonAssetsPath}/door/ambientOcclusion.jpg`);
const METALNESS_TEXTURE = TEXTURE_LOADER.load(`${lessonAssetsPath}/door/metalness.jpg`);
const ROUGHNESS_TEXTURE = TEXTURE_LOADER.load(`${lessonAssetsPath}/door/roughness.jpg`);
const MATCAP_TEXTURE = TEXTURE_LOADER.load(`${lessonAssetsPath}/matcaps/1.png`);
const GRADIENT_TEXTURE = TEXTURE_LOADER.load(`${lessonAssetsPath}/gradients/3.jpg`);

COLOR_TEXTURE.colorSpace = THREE.SRGBColorSpace;
MATCAP_TEXTURE.colorSpace = THREE.SRGBColorSpace;


// Debug UI
const G_U_I = new GUI({width: 300, title: "Slider U.I Panel", closeFolders: false,});;
// G_U_I.close();


window.addEventListener("keydown",(event) => {
    event.key === "h" && G_U_I.show(G_U_I._hidden);
})

const debugObject = {color: new THREE.Color(0x888888), segments: {width: 2}, scale: 0, spinPlane: () => {}, spinSphere: () => {}, spinRing: () => {}}

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
    // const GENERIC_MATERIAL = new THREE.MeshBasicMaterial({
        // color: debugObject.color,
        // map: COLOR_TEXTURE,
        // alphaMap: ALPHA_TEXTURE,
        // aoMap: AMBIENT_OCCLUSION_TEXTURE,
        
        // }); 
        // GENERIC_MATERIAL.transparent = true;// <- needed for opacity to work
        // GENERIC_MATERIAL.opacity = 0.5;

        // MeshNormalMaterial
        // const GENERIC_MATERIAL = new THREE.MeshNormalMaterial(); // Nice colours

        // MeshNormalMaterial
        // const GENERIC_MATERIAL = new THREE.c({matcap: MATCAP_TEXTURE}); // Fake lightning effect ( optimized)

        // MeshDepthMaterial
        // const GENERIC_MATERIAL = new THREE.MeshDepthMaterial(); // Mostly used for shadows
        
        // MeshLambertMaterial
        // const GENERIC_MATERIAL = new THREE.MeshLambertMaterial(); // Actual light processing
        // const AMBIENT_LIGHT = new THREE.AmbientLight(0xffffff,1);
        // SCENE.add(AMBIENT_LIGHT);
        // const POINT_LIGHT = new THREE.PointLight(0xffffff,30);
        // SCENE.add(POINT_LIGHT);
        // POINT_LIGHT.position.set(0,0, 3);

        // MeshPhongMaterial
        // const GENERIC_MATERIAL = new THREE.MeshPhongMaterial(); //  More features for lighting but less performant
        // const AMBIENT_LIGHT = new THREE.AmbientLight(0xffffff,1);
        // SCENE.add(AMBIENT_LIGHT);
        // const POINT_LIGHT = new THREE.PointLight(0xffffff,30);
        // SCENE.add(POINT_LIGHT);
        // POINT_LIGHT.position.set(1,0, 3);
        // GENERIC_MATERIAL.shininess = 100;
        // GENERIC_MATERIAL.specular = new THREE.Color(0x1188ff);
      
        // MeshToonMaterial
        // const GENERIC_MATERIAL = new THREE.MeshToonMaterial();
        // const AMBIENT_LIGHT = new THREE.AmbientLight(0xffffff, 1);
        // SCENE.add(AMBIENT_LIGHT);
        // const POINT_LIGHT = new THREE.PointLight(0xffffff, 30);
        // SCENE.add(POINT_LIGHT);
        // POINT_LIGHT.position.set(3, -1, 3);
        // GRADIENT_TEXTURE.minFilter = THREE.NearestFilter;
        // GRADIENT_TEXTURE.magFilter = THREE.NearestFilter;
        // GRADIENT_TEXTURE.generateMipmaps = false;
        // GENERIC_MATERIAL.gradientMap = GRADIENT_TEXTURE;

        // MeshStandardMaterial
        // const GENERIC_MATERIAL = new THREE.MeshStandardMaterial({
        //     map: COLOR_TEXTURE,
        //     aoMap: AMBIENT_OCCLUSION_TEXTURE,
        //     aoMapIntensity: 2,
        //     displacementMap: HEIGHT_TEXTURE,
        //     displacementScale: 0.1,
        //     metalnessMap: METALNESS_TEXTURE,
        //     roughnessMap: ROUGHNESS_TEXTURE,
        //     normalMap: NORMAL_TEXTURE,
        //     normalScale: new THREE.Vector2(0.5,0.5),
        //     transparent: true,
        //     alphaMap: ALPHA_TEXTURE,
        // });

        // GENERIC_MATERIAL.roughness = 1;
        // GENERIC_MATERIAL.metalness = 1;
        // const AMBIENT_LIGHT = new THREE.AmbientLight(0xffffff, 1);
        // SCENE.add(AMBIENT_LIGHT);
        // const POINT_LIGHT = new THREE.PointLight(0xffffff, 30);
        // SCENE.add(POINT_LIGHT);
        // POINT_LIGHT.position.set(3, -1, 3);
        // GENERIC_MATERIAL.roughness = 0.1; // values before using aoMap to roughness-metalness maps
        // GENERIC_MATERIAL.metalness = 0.8;

        // MeshPhysicalMaterial
        const GENERIC_MATERIAL = new THREE.MeshPhysicalMaterial({
            // map: COLOR_TEXTURE,
            // aoMap: AMBIENT_OCCLUSION_TEXTURE,
            // aoMapIntensity: 2,
            // displacementMap: HEIGHT_TEXTURE,
            // displacementScale: 0.1,
            // metalnessMap: METALNESS_TEXTURE,
            // roughnessMap: ROUGHNESS_TEXTURE,
            // normalMap: NORMAL_TEXTURE,
            // normalScale: new THREE.Vector2(0.5,0.5),
            // transparent: true,
            // alphaMap: ALPHA_TEXTURE,
            // clearcoat: 1,
            // clearcoatRoughness: 0,
            // sheen: 1,
            // sheenRoughness: 0,
            // sheenColor: new THREE.Color(1,1,1),
            // iridescence: 1,
            // iridescenceIOR: 1,
            // iridescenceThicknessRange: [ 100, 800 ],
            transmission: 1,
            ior: 4, // index of refraction
            thickness: 0.5,
        });

        GENERIC_MATERIAL.roughness = 0;
        GENERIC_MATERIAL.metalness = 0;
        G_U_I.add(GENERIC_MATERIAL, 'metalness', 0, 1,0.1);
        G_U_I.add(GENERIC_MATERIAL, 'roughness', 0, 1,0.1);
        G_U_I.add(GENERIC_MATERIAL, 'clearcoat', 0, 1,0.1)
        G_U_I.add(GENERIC_MATERIAL, 'clearcoatRoughness', 0, 1,0.1);
        G_U_I.add(GENERIC_MATERIAL, 'sheen',0, 1,0.1);
        G_U_I.add(GENERIC_MATERIAL, 'sheenRoughness', 0, 1,0.1);
        G_U_I.addColor(GENERIC_MATERIAL, 'sheenColor', 0, 1,0.1);
        G_U_I.add(GENERIC_MATERIAL, 'iridescence').min(0).max(1).step(0.0001);
        G_U_I.add(GENERIC_MATERIAL, 'iridescenceIOR').min(1).max(2.333).step(0.0001);
        G_U_I.add(GENERIC_MATERIAL.iridescenceThicknessRange, '0').min(1).max(1000).step(1);
        G_U_I.add(GENERIC_MATERIAL.iridescenceThicknessRange, '1').min(1).max(1000).step(1);
        G_U_I.add(GENERIC_MATERIAL, 'transmission').min(0).max(1).step(0.0001);
        G_U_I.add(GENERIC_MATERIAL, 'ior').min(1).max(10).step(1);
        G_U_I.add(GENERIC_MATERIAL, 'thickness').min(0).max(1).step(0.0001);

        // Environment map
        const RGBE_LOADER = new RGBELoader();
        RGBE_LOADER.load(`${lessonAssetsPath}/environmentMap/2k.hdr`, (environmentMap: any) =>
        {
            environmentMap.mapping = THREE.EquirectangularReflectionMapping;
            SCENE.background = environmentMap;
            SCENE.environment = environmentMap;
        })

        // For all Material types 
        GENERIC_MATERIAL.side = THREE.DoubleSide;
    // Rinrg
    const RING = new THREE.Mesh(
        new THREE.TorusGeometry(1, 0.35,32,100), 
        GENERIC_MATERIAL
        // GENERIC_MATERIAL
    ) 
    RING.position.set(1.5,0,0);
    RING.scale.set(0.5,0.5,0.5);
    // Cube
    const PLANE = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1, 100, 100), 
        GENERIC_MATERIAL
)
    PLANE.position.set(0,0,0);
    
    const SPHERE = new THREE.Mesh(
        new THREE.SphereGeometry(), 
        GENERIC_MATERIAL
)
    SPHERE.position.set(-1.5,0,0);
    SPHERE.scale.set(0.5,0.5,0.5)

// Group
const GROUP = new THREE.Group();
GROUP.add(RING, PLANE, SPHERE);
// // Aggregate
// SCENE.add(PLANE, RING, SPHERE);
SCENE.add(GROUP);

// Gui objects
// const LIMITS = [-25, 25, 1]
const [MIN, MAX, STEP, ALIAS] = [-25, 25, 1, 'Horizontal mov.']
G_U_I.add(PLANE.position, 'x', MIN, MAX, STEP)
    .name(ALIAS);

G_U_I.add(PLANE, 'visible');

// Support for whole scale modification
debugObject.scale = 0;
G_U_I.add(debugObject, 'scale', 0,5,0.1).name('Scale all').onChange(() => {
    const VALS = new Array(3).fill(debugObject.scale)
    PLANE.scale.set(...VALS);
    PLANE.scale.x = debugObject.scale;
});

G_U_I.add(PLANE.material, 'wireframe');
// solution that properly matches the color picked in lil-ui and three js internal color managemenr
G_U_I.addColor(debugObject, 'color').onChange(() =>
    {
        PLANE.material.color.set(debugObject.color)
    })



// Adding segment slider and geometry change (a box with segments)
debugObject.segments = {width: 2};
G_U_I.add(debugObject.segments, 'width').min(1).max(4).step(1).name("Width segments").onFinishChange(() => {
    PLANE.geometry.dispose(); // it frees memory and avoids leaks from previously instanced entities
    PLANE.geometry =  new THREE.BoxGeometry(1,1,1,debugObject.segments.width)
});

debugObject.spinPlane = ( ) => {
    gsap.to(PLANE.rotation, {y: PLANE.rotation.y + Math.PI * 0.5})
};
debugObject.spinSphere = ( ) => {
    gsap.to(SPHERE.rotation, {y: SPHERE.rotation.y + Math.PI * 0.5})
};
debugObject.spinRing = ( ) => {
    gsap.to(RING.rotation, {y: RING.rotation.y + Math.PI * 0.5})
};
// simple button click spin animation on the gui
// GUI Folder code for organization
const MESH_TWEAKS = G_U_I.addFolder('Animation Folder');
MESH_TWEAKS.add(debugObject, 'spinPlane');
MESH_TWEAKS.add(debugObject, 'spinRing');
MESH_TWEAKS.add(debugObject, 'spinSphere');
MESH_TWEAKS.close();
// Camera
const ASPECT_RATIO = SIZES.width / SIZES.height
const CAMERA = new THREE.PerspectiveCamera(75, ASPECT_RATIO, 1, 100);

CAMERA.position.set(0, 0, 5);
CAMERA.lookAt(PLANE.position)
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
    
    GROUP.rotation.x += 0.01;
    // GROUP.rotation.y += 0.01;
    // GROUP.rotation.z += 0.01;
    CONTROL.update();
    RENDERER.render(SCENE, CAMERA);
    window.requestAnimationFrame(tick);
}

tick();}
