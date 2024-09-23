<script lang="ts">
	import { page } from '$app/stores';
</script>

<svelte:head>
	{#if /classic_techniques$/.test($page.url.pathname)}
		<title>TSJ. Classic Techniques</title>
		<meta name="Basics" content="Example set of basic techniques regarding ThreeJS" />
	{:else}
		{@const lesson = $page.params.page}
		<title>TSJ. {lesson}</title>
		<meta name="Basics lesson {lesson}" content="Lesson {lesson} code" />
	{/if}
</svelte:head>
<slot />
