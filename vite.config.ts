import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
	plugins: [
		sveltekit(),
		glsl({
			include: [
				// Glob pattern, or array of glob patterns to import
				'**/*.glsl',
				'**/*.wgsl',
				'**/*.vert',
				'**/*.frag',
				'**/*.vs',
				'**/*.fs'
			],
			exclude: undefined, // Glob pattern, or array of glob patterns to ignore
			warnDuplicatedImports: true, // Warn if the same chunk was imported multiple times
			removeDuplicatedImports: true, // Automatically remove an already imported chunk
			defaultExtension: 'glsl', // Shader suffix when no extension is specified
			watch: true // Recompile shader on change
		})
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	css: {
		preprocessorOptions: {
			scss: {
				api: 'modern-compiler' // or "modern"
			}
		}
	}
});
