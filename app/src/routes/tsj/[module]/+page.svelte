<script lang="ts">
	import { page } from '$app/stores';
	import { differences } from '../../../lib/lesson/content/differences';
	import tsj from '$lib/lesson/content/titles';
	const module = $page.params.module as keyof typeof tsj;
	const titles = tsj[module];

	// const offsetParams = {
	// 	basics: 0,
	// 	classic_techniques: 13,
	// 	advanced_techniques: 20
	// 	// ['', 27],
	// 	// ['', 44],
	// 	// ['', 48],
	// 	// ['', 52]
	// };
	console.log(titles);
</script>

<slot />
<article>
	<h2>Summary of personal tweaks on basic lessons{module}</h2>
	{#each titles as title, i (title)}
		<section>
			<h3>{i + 1} ~ {title}</h3>
			{#each differences[module] as tweak (tweak)}
				<p>{tweak}</p>
			{:else}
				Empty
			{/each}
		</section>
	{/each}
</article>

<style lang="scss">
	article {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		height: 100%;
		overflow: scroll;
		section {
			width: 50%;
			height: 100%;
		}
	}
	h2 {
		font-size: 27px;
	}
	h3 {
		font-size: 18px;
	}
</style>
