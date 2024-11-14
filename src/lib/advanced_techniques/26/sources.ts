const sources: TSource[] = [
	{
		name: 'environmentMapTexture',
		type: 'cubeTextureLoader',
		path: [
			'/assets/advanced/26/textures/environmentMap/px.jpg',
			'/assets/advanced/26/textures/environmentMap/nx.jpg',
			'/assets/advanced/26/textures/environmentMap/py.jpg',
			'/assets/advanced/26/textures/environmentMap/ny.jpg',
			'/assets/advanced/26/textures/environmentMap/pz.jpg',
			'/assets/advanced/26/textures/environmentMap/nz.jpg'
		]
	},
	{
		name: 'grassColorTexture',
		type: 'textureLoader',
		path: '/assets/advanced/26/textures/dirt/color.jpg'
	},
	{
		name: 'grassNormalTexture',
		type: 'textureLoader',
		path: '/assets/advanced/26/textures/dirt/normal.jpg'
	},
	{
		name: 'wolfModel',
		type: 'gltfLoader',
		path: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/wolf/model.gltf'
	}
];
type TLoader = 'gltfLoader' | 'textureLoader' | 'cubeTextureLoader';
// type TPath = { gltfLoader: string; textureLoader: string; cubeTextureLoader: string[] };
export type TSource<> = {
	name: string;
	type: TLoader;
	path: string | string[];
};
export default sources;
