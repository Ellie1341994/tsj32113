<script lang="ts">
	import { page } from '$app/stores';
	import { fade, fly } from 'svelte/transition';
	console.log('checking for duplicated execution: basics');
</script>

{#key $page.params.page}
	<span in:fade={{ delay: 1000, duration: 1000 }} out:fade={{ duration: 500 }}><slot /></span>
{/key}
