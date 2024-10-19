<script lang="ts">
	import { page } from '$app/stores';
	$: challenge = $page.params.challenge as any;
</script>

{#key challenge}
	<main>
		<slot />
	</main>
{/key}

<style>
	main {
		width: 100vw;
		height: 100vh;
	}
</style>
