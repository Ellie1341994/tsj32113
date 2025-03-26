<script lang="ts">
	import { page } from '$app/state';
	import Icon from '$lib/icon.svelte';
	import Wip from '$lib/Wip.svelte';
	import { submodules } from '../../../lib/lesson/content/info';
	let {
		titlePlacer = $bindable(),
		height = innerHeight * 0.25,
		width = innerWidth * 0.25
	} = $props();
	let lesson = $derived(parseInt(page.params.lesson));
	let module = $derived(page.params.module);
	console.log('lesson page loading');
</script>

{#await import(`../../../lib/${module}/${lesson}.svelte`)}
	<Icon {width} {height} style="border-bottom: 1vh solid #573A32" />
{:then { default: Scene }}
	{@const title = submodules[lesson - 1]}
	<Scene />
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
{:catch issue}
	<Wip />
{/await}
