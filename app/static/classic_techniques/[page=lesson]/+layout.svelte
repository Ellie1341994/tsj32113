<script lang="ts">
	import { page } from '$app/stores';
	import Icon2 from '$lib/icon2.svelte';
	import { lessonTitles } from '$lib/lessonTitles';
	let titlePlacer: HTMLSpanElement;
	$: lesson = parseInt($page.params.page);
</script>

{#await import(`../../../../lib/classic_techniques/${lesson}.svelte`)}
	<Icon2 />
{:then Scene}
	<svelte:component this={Scene.default} />
	<span
		bind:this={titlePlacer}
		class={`lesson-title-placer ${lesson > 6 ? 'big-canvas' : 'small-canvas'}`}
		>{lessonTitles[lesson - 1]}</span
	>
	<style lang="scss">
		span.lesson-title-placer {
			position: absolute;
			&.big-canvas {
				top: 18vh;
				left: 13vw;
			}
			&.small-canvas {
				top: calc(20vh + 75vh / 2 - 300px);
				left: calc(50vw - 400px);
			}
			background-color: var(--color-theme-4);
			padding: 0.5vw 1vw;
			font-weight: bold;
			/* border: 10px solid var(--color-theme-4); */
			border-radius: 9px;
		}
	</style>
{/await}
