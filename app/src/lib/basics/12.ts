
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

// import typefaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json'
export default ({THREE, OrbitControls, RGBELoader, GUI, gsap, canvas}: any) => {
const lessonAssetsPath = "../../src/lib/basics/assets/12/textures"
const LOADING_MANAGER = new THREE.LoadingManager();
const TEXTURE_LOADER = new THREE.TextureLoader(LOADING_MANAGER);
const MATCAP_TEXTURE = TEXTURE_LOADER.load(`${lessonAssetsPath}/matcaps/2.png`);
const MATCAP_TEXTURE_ALT = TEXTURE_LOADER.load(`${lessonAssetsPath}/matcaps/2.png`);
MATCAP_TEXTURE.colorSpace = THREE.SRGBColorSpace;
MATCAP_TEXTURE_ALT.colorSpace = THREE.SRGBColorSpace;

/**
 * Base
 */
// Debug
const gui = new GUI({
  width: 300,
  title: "Slider U.I Panel",
  closeFolders: false,
});
gui.hide();

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

/**
 * Object
 */

const DONUT_GEOMETRY = new THREE.TorusGeometry(0.6, 0.1, 20, 45, undefined, 9);
const DONUT_MATERIAL = new THREE.MeshMatcapMaterial({
  matcap: MATCAP_TEXTURE_ALT,
});
const DONUTS: typeof DONUT = [];
let DONUT: any = undefined;
for (let i = 0; i <= 99; i++) {
  DONUT = new THREE.Mesh(DONUT_GEOMETRY, DONUT_MATERIAL);

  DONUTS.push(DONUT);

  ["x", "y", "z"].forEach((dimension) => {
    DONUT.position[dimension] = (Math.random() - 0.5) * 25;
    DONUT.rotation[dimension] = Math.random() * Math.PI;
    DONUT.scale[dimension] = Math.random() * 2 + 0.5;
  });
}
scene.add(...DONUTS);

// scene.add(cube)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth * 0.75,
  height: window.innerHeight * 0.75,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0, 0, 15);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
/**
 * Font
 */
const FONT_LOADER = new FontLoader();
FONT_LOADER.load(`../../src/lib/basics/assets/12/fonts/helvetiker_regular.typeface.json`, (font) => {
  // console.log('font loaded');
  let TEXT_GEOMETRY_OPTIONS = {
    font,
    size: 2,
    depth: 0,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.73,
    bevelSize: 0.1,
    bevelOffset: 0,
    bevelSegments: 9,
  };
  const TEXT_GEOMETRY: any = new TextGeometry(
    "Ellie Broocks",
    TEXT_GEOMETRY_OPTIONS
  );
  TEXT_GEOMETRY.computeBoundingBox();
  TEXT_GEOMETRY.translate(
    -(TEXT_GEOMETRY.boundingBox.max.x - 0.02) * 0.5,
    -(TEXT_GEOMETRY.boundingBox.max.y - 0.02) * 0.5,
    -(TEXT_GEOMETRY.boundingBox.max.z - 0.02) * 0.5
  );
  const TEXT_MATERIAL = new THREE.MeshMatcapMaterial({
    matcap: MATCAP_TEXTURE,
  });
  const TEXT = new THREE.Mesh(TEXT_GEOMETRY, TEXT_MATERIAL);
  TEXT.position.set(0, 0, 0);
  scene.add(TEXT);
  gui.add(TEXT_GEOMETRY.parameters.options, "bevelSize", 0, 1, 0.01).onChange(
    (value: any) => {
      // console.log(`has bevelSize ${TEXT_GEOMETRY.hasAttribute('bevelSize')}`)
      TEXT_GEOMETRY_OPTIONS.bevelSize = value;
      (TEXT_GEOMETRY || TEXT.geometry).dispose();
      TEXT.geometry = new TextGeometry("Ellie Broocks", TEXT_GEOMETRY_OPTIONS);
    }
    // console.log(TEXT_GEOMETRY.parameters.options.bevelSize)}
  );
  // controls.update();
});
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();
  // gui.update()
  DONUTS.forEach((DONUT: any) => {
    DONUT.rotation.x += 0.01;
    DONUT.rotation.y += 0.01;
    DONUT.rotation.x += 0.01;
  });
  // Render
  renderer.render(scene, camera);
  gui.onChange(() => {
    renderer.render(scene, camera);
    console.log("Re-rendered");
  });

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
}