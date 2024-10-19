<script lang="ts">
	import { page } from '$app/stores';
	import Icon2 from '$lib/icon2.svelte';
	$: challenge = $page.params.challenge;
</script>

{#await import(`../../../lib/challenges/${challenge}.svelte`)}
	<Icon2 />
{:then challenge}
	<svelte:component this={challenge.default} />
	<!-- <slot /> -->
{/await}
