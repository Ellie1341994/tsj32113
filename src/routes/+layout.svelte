<script lang="ts">
	import '../app.css';
	import Icon from '$lib/icon.svelte';
	import Footer from '$lib/Footer.svelte';
	import { page } from '$app/state';
	const href = '/';
	let { children } = $props();
	function capitalize(string: string) {
		let newString = '';
		if (string) {
			const [char, ...subString] = string as unknown as [string, string[]];
			newString = char.toUpperCase() + subString.join('');
		}
		return newString;
	}

	let titleText = $derived(
		`T.J.S. ${capitalize(page.params.module).replace(/_.*/, '') || capitalize(page.params.challenge) || (page.url.pathname === href ? 'Home' : 'Challenges')}`
	);
</script>

<svelte:head>
	<title>{titleText}</title>
	<link rel="icon" href="/icon.svg" type="image/x-icon" />
	<meta name="challenges" />
</svelte:head>

<div class="app">
	{#if page.url.pathname !== href}
		<a id="main-nav-icon" {href}>
			<Icon colored={true} stem={false} style={`height: 5vh; width: 5vw;`} pathShadow={true} />
		</a>
	{/if}
	{@render children()}
	{#key page.url.pathname}
		<Footer pathname={page.url.pathname}></Footer>
	{/key}
</div>

<style lang="scss">
	#main-nav-icon {
		position: fixed;
		top: 0vh;
		left: 0vh;
		margin: 2.5vh 0;
	}
	.app {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 100vh;
	}
</style>
