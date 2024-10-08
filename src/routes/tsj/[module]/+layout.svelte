<script lang="ts">
	import { page } from '$app/stores';
	// import { fade, fly } from 'svelte/transition';

	$: module = $page.params.module;

	$: lesson = parseInt($page.params.lesson);
	// console.log(`checking: - duplicated execution: basics, url params: ${$page.url}`, $page.params);
</script>

{#key module || lesson}
	<!-- <span in:fade={{ delay: 1000, duration: 1000 }} out:fade={{ duration: 500 }}><slot /></span> -->
	<slot />
{/key}
