<script lang="ts">
	import { page } from '$app/stores';
	import Header from '../Header.svelte';
	// import { fade, fly } from 'svelte/transition';
	$: module = $page.params.module as any;
	$: lesson = parseInt($page.params.lesson);
</script>

{#key module || lesson}
	<!-- <span in:fade={{ delay: 1000, duration: 1000 }} out:fade={{ duration: 500 }}><slot /></span> -->
	<Header {lesson} {module} />

	<main>
		<slot />
	</main>
{/key}

<style>
	main {
		/* flex: 1; */
		display: flex;
		flex-direction: column;
		/* padding: 0%; */
		width: 100vw;
		height: 75vh;
		/* margin: 0 auto; */
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
	}
</style>
