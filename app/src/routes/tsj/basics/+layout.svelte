<script lang="ts">
	import { page } from '$app/stores';
</script>

<svelte:head>
	{#if /basics$/.test($page.url.pathname)}
		<title>TSJ. Basic Techniques</title>
		<meta name="Basics" content="Example set of basic techniques regarding ThreeJS" />
	{:else}
		{@const lesson = $page.params.page}
		<title>TSJ. {lesson}</title>
		<meta name="Basics lesson {lesson}" content="Lesson {lesson} code" />
	{/if}
</svelte:head>

<div style="margin: 0; padding: 0; width: 75%;">
	<ul
		style="list-style-type: none; display: flex; padding: 0;
  				justify-content: space-evenly; flex-direction:row; width: 100%%;"
	>
		{#each [...Array(13).keys()] as index (index)}
			{@const lesson = `${index + 1}`}
			{@const active = lesson === $page.params.page}
			<li
				class="lesson-link-container"
				aria-current={$page.url.pathname === '/tsj/basics' ? 'page' : undefined}
			>
				<a
					aria-disabled={!active}
					class={`lesson-link ${active ? 'current' : ''}`}
					href="/tsj/basics/{lesson}">{lesson}</a
				>
			</li>
		{/each}
	</ul>
</div>

{#key $page.params.page}
	<slot />
{/key}

<style>
	li.lesson-link-container {
		background-color: transparent;
		flex-wrap: wrap;
		width: 35px;
		padding: 9px;
		margin: 0%;
		text-align: center;
	}
	a.lesson-link {
		font-size: 27px;
		text-align: center;
		color: white;
		padding: 0vw;
		text-decoration: none;
	}
	li:has(a.lesson-link.current) {
		/* border-left: 1px solid var(--color-theme-1); */
		border-bottom: 6px solid var(--color-theme-3);
		border-top: 6px solid var(--color-theme-3);
		border-radius: 25%;
		pointer-events: none;
	}

	a:hover:not(.current) {
		color: var(--color-theme-3);
	}
</style>
