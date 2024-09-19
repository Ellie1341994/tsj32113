<script>
	import { page } from '$app/stores';
</script>

<svelte:head>
	{#if /basics$/.test($page.url.pathname)}
		<title>TSJ. Basic Techniques</title>
		<meta name="Basics" content="Example set of basic techniques regarding ThreeJS" />
	{:else}
		{@const subpath = $page.url.pathname.match(/\d$/)?.shift()}
		<title>TSJ. {subpath}</title>
		<meta name="Basics lesson {subpath}" content="Lesson {subpath} code" />
	{/if}
</svelte:head>

<slot />
