<script lang="ts">
	import '../app.css';
	import Icon from '$lib/icon.svelte';
	import Footer from '$lib/Footer.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	function capitalize(s: string) {
		let newString = '';
		if (s) {
			const [c, ...ss] = s as unknown as [string, string[]];
			newString = '> ' + c.toUpperCase() + ss.join('');
		}
		console.log('r is', newString);
		return newString;
	}

	$: titleText = `T.J.S. ${$page.params.module ? 'Projects' : 'Challenges ' + capitalize($page.params.challenge)}`;
	$: pathname = $page.url.pathname;
	$: href = pathname?.split('/').toSpliced(-1).join('/') || '/';
	$: height = 15;
	$: width = 15;
	onMount(() => {
		height = innerHeight * 0.04;
		width = innerHeight * 0.04;
	});
	console.log('challengeVar', $page.params);
</script>

<svelte:head>
	<title>{titleText}</title>
	<link rel="icon" href="/icon.svg" type="image/x-icon" />
	<meta name="challenges" />
</svelte:head>

<div class="app">
	{#if pathname !== href && !$page.params.challenge}
		<a id="main-nav-icon" {href}
			><Icon
				colored={true}
				style={`transform: rotate(${new Date().getHours() * 0.25}turn);`}
				{height}
				{width}
			/></a
		>
	{/if}
	<slot />
	<Footer pathname={$page.url.pathname}></Footer>
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
</style>
