<script lang="ts">
	import { page } from '$app/state';
	const challenge = $derived(page.params.challenge);
</script>

{#await import(`../../../lib/challenges/${challenge}.svelte`)}
	<strong>...</strong>
{:then { default: Challenge }}
	<!-- <svelte:component this={challenge.default} /> -->
	<Challenge />
{/await}

<style lang="scss">
	strong {
		font-size: 10vh;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		width: 100%;
	}
</style>
