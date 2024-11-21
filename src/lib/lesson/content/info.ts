export const information = {
	basics: [
		'Introduction to ThreeJs',
		'What is WebGL and why use Three.js',
		'First Three.js Project',
		'Transform Objects',
		'Animation',
		'Cameras',
		'Fullscreen and resizing',
		'Geometries',
		'Debug UI',
		'Textures',
		'Materials',
		'3D Text',
		'Go Live'
	],
	classic_techniques: [
		'Lights',
		'Shadows',
		'Haunted House',
		'Particles',
		'Galaxy Generator',
		'Scroll based animation'
	],
	advanced_techniques: [
		'Physics',
		'Imported models',
		'Raycaster and Mouse Events',
		'Custom models with Blender',
		'Environment map',
		'Realistic render',
		'Code structuring for bigger projects'
	],
	shaders: [
		'Shaders',
		'Shader patterns',
		'Raging sea',
		'Animated galaxy',
		'Modified materials',
		'Coffee Smoke',
		'Hologram',
		'Fireworks',
		'Lights Shading',
		'Raging Sea Shading',
		'Halftone Shading',
		'Earth',
		'Particles Cursor Animation',
		'Particles Morphing',
		'GPGPU Flow Field Particles',
		'Wobbly Sphere',
		'Sliced Model',
		'Procedural Terrain'
	]
};

export const modules = Object.keys(information);
export const submodules = Object.values(information).flat();

export default information;
