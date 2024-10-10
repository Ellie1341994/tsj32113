<script>
	import Header from './Header.svelte';
	import '../app.css';
</script>

<div class="app">
	<slot />

	<footer>
		<p>Creative pratices by <strong>Ellie Broocks</strong></p>
	</footer>
</div>

<style lang="scss">
	.app {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 100vh;
	}

	footer {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 10vh;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
