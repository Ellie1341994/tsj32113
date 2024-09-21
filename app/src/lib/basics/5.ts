

export default ({THREE, gsap, canvas}: any) => {
// Scene
const SCENE = new THREE.Scene();

// Axis Helper

const AXES_HELPER = new THREE.AxesHelper(27, );
AXES_HELPER.rotation.set(Math.PI/12, -Math.PI/6, 0)
AXES_HELPER.setColors("green", "magenta", "yellow")

// Objects
    // Group
const GROUP = new THREE.Group();
GROUP.scale.y = 1;
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





// Animations with native js fix for differente machine framerates
// let time = Date.now();

// const Tick = () => {
//     // test log
//     console.log('tick')
//     // Changing prop
//     const CURRENT_TIME = Date.now();
//     const DELTA_TIME = CURRENT_TIME - time;
//     time = CURRENT_TIME;
//     MESH.rotation.z += -0.001 * DELTA_TIME;
//     CUBE2.rotation.x += 0.001 * DELTA_TIME;
//     CUBE3.rotation.z += 0.001 * DELTA_TIME;
//     // GROUP.rotation.y += 0.01;
//     // Render
//     RENDERER.render(SCENE, CAMERA);
//     window.requestAnimationFrame(Tick);
// }

// Tick();


// Animations using Clock solution for different machine framerates
// const CLOCK = new THREE.Clock();
// const Tick = () => {
//     // test log
//     console.log('tick')

//     const ELAPSED_TIME = CLOCK.getElapsedTime();
//     // Changing prop
//     MESH.rotation.z = ELAPSED_TIME * Math.PI;
//     CUBE2.rotation.x = ELAPSED_TIME * Math.PI * -0.5;
//     CUBE3.rotation.z = ELAPSED_TIME * Math.PI;
    
//     // Using trigonometry for fun animations
//     CUBE2.position.y = Math.cos(ELAPSED_TIME);
//     CUBE2.position.z = -Math.sin(ELAPSED_TIME);
//     const scaleValue = Math.sin(ELAPSED_TIME) + 1.25;
//     CUBE2.scale.set(scaleValue, scaleValue, scaleValue);

//     // GROUP.rotation.y += 0.01;
//     // Render
//     RENDERER.render(SCENE, CAMERA);
//     window.requestAnimationFrame(Tick);
// }

// Tick();


// gsap.to(MESH.position, {duration: 1, delay: 0, x:2, repeat: -1, repeatDelay: 1});
gsap.fromTo(MESH.position, {x: 1.45, }, {duration: 1, delay: 0.1, x: 2, repeat: -1, yoyo: true});
gsap.fromTo(CUBE3.position, {x: -1.45, }, {duration: 1, delay: 0.1, x: -2, repeat: -1, yoyo: true});

const Tick = () => {
    // test log
    console.log('tick');
    //     // Render
    RENDERER.render(SCENE, CAMERA);
    window.requestAnimationFrame(Tick);
}

Tick();}