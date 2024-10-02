<script lang="ts">
	import { page } from '$app/stores';
	import Icon2 from '$lib/icon2.svelte';

	let lesson = parseInt($page.params.page);
</script>

{#await import(`../../../../lib/basics/${lesson}.svelte`)}
	<Icon2 />
{:then Scene}
	<svelte:component this={Scene.default} />
{/await}
