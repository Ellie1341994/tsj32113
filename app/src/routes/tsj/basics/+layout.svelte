<script lang="ts">
	import { page } from '$app/stores';
</script>

{#key $page.params.page}
	<slot />
{/key}
