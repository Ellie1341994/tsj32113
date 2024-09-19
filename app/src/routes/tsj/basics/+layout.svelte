<script lang="ts">
	import { page } from '$app/stores';
	let lesson = $page.params.page;
</script>

<svelte:head>
	{#if /basics$/.test($page.url.pathname)}
		<title>TSJ. Basic Techniques</title>
		<meta name="Basics" content="Example set of basic techniques regarding ThreeJS" />
	{:else}
		<title>TSJ. {lesson}</title>
		<meta name="Basics lesson {lesson}" content="Lesson {lesson} code" />
	{/if}
</svelte:head>

<slot />
