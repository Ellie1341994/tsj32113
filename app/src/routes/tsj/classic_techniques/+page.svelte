<script>
	import { lessonTitles } from '$lib/lessonTitles';
</script>

<slot />
<article>
	<h2>Summary of personal tweaks on classic techniques lessons</h2>
	{#each lessonTitles.slice(13, 20) as sectionTitle, i (sectionTitle)}
		<section>
			<h3>{i + 14} ~ {sectionTitle}</h3>
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laudantium iste voluptatem doloremque
			quia praesentium maxime, officia recusandae incidunt, dolore eveniet, quas iusto expedita! Cum
			ad molestiae rem qui velit culpa.
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
