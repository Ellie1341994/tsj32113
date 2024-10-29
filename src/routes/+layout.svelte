<script>
	import '../app.css';
	import Icon2 from '$lib/icon2.svelte';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	export const ssr = false;
	$: pathname = $page.url.pathname;
	$: href = pathname?.split('/').toSpliced(-1).join('/');
	let height = 15;
	let width = 15;
	if (browser) {
		height = innerHeight * 0.04;
		width = innerHeight * 0.04;
	}
</script>

<div class="app">
	<a
		id="main-nav-icon"
		style={pathname === '' ? 'pointer-events: none;' : ''}
		href={href === '' ? '/' : href}
		><Icon2
			leafColors={{ bottom: '#994f7a', top: '#D876B6', left: '#BB5992', right: '#A75484' }}
			colored={true}
			{height}
			{width}
		/></a
	>
	<slot />
	<footer>
		<p>
			Creative practices by <strong
				><a style="color: black;" href="https://x.com/0E11ie" target="_blank">Ellie Broocks</a
				></strong
			>
		</p>
	</footer>
</div>

<style lang="scss">
	#main-nav-icon {
		position: fixed;
		top: 0vh;
		left: 1vh;
		height: 5vh;
		padding: 0;
		margin: 0;
		display: flex;
		align-items: center;
		// border-bottom: 1px solid black;
	}
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
