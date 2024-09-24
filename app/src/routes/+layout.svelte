<script>
	import Header from './Header.svelte';
	import '../app.css';
	import { page } from '$app/stores';
	$: isRoot = $page.url.pathname === '/';
</script>

<div class="app">
	{#if !isRoot}
		<Header />
	{/if}

	<main>
		<slot />
	</main>

	<footer>
		<p>Creative pratices by <strong>Ellie Broocks</strong></p>
	</footer>
</div>
<slot />

<style>
	.app {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 100vh;
	}

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
		/* box-sizing: border-box; */
	}

	footer {
		display: flex;
		justify-content: center;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
