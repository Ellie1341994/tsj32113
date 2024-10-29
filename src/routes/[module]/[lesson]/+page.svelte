<script lang="ts">
	import { page } from '$app/stores';
	import Icon2 from '$lib/icon2.svelte';
	import { submodules } from '../../../lib/lesson/content/info';
	let titlePlacer: HTMLSpanElement;
	$: lesson = parseInt($page.params.lesson);
	$: module = $page.params.module;
</script>

{#await import(`../../../lib/${module}/${lesson}.svelte`)}
	<Icon2 />
{:then Scene}
	{@const title = submodules[lesson - 1]}
	<svelte:component this={Scene.default} />
	{#if lesson > 2}
		<span bind:this={titlePlacer} class={`lesson-title-placer`}>{title}</span>

		<style lang="scss">
			span.lesson-title-placer {
				position: absolute;
				top: 15vh;
				left: 12.5vw;
				background-color: var(--color-theme-4);
				padding: 1vh;
				// height: 1vh;
				font-weight: bold;
				/* border: 10px solid var(--color-theme-4); */
				border-radius: 0 0 1vh 0;
			}
		</style>
	{/if}
{/await}
