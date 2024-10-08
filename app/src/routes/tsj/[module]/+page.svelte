<script lang="ts">
	import { page } from '$app/stores';
	import { differences } from '../../../lib/lesson/content/differences';
	import information from '$lib/lesson/content/info';
	const module = $page.params.module as keyof typeof information;
	const titles = information[module];

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
	<h2>
		{[...module].map((c, i) => (i === 0 ? c.toUpperCase() : c === '_' ? ' ' : c)).join('')} personal
		tweaks
	</h2>
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
