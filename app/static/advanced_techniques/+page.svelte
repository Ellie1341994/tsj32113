<script>
	import lessonTitles from '$lib/static/lessons/content/titles';
	import { DIFFERENCES } from '$lib/static/lessons/content/differences';
</script>

<!-- <slot /> -->
<article>
	<h2>Personal takes on lessons</h2>
	{#each lessonTitles.slice(20, 26) as sectionTitle, i (sectionTitle)}
		<section>
			<h3>{i + 21} <i style="font-size: 27px;">~</i> {sectionTitle}</h3>
			{#each Object.values(DIFFERENCES[sectionTitle] || {}) as DIF (DIF)}
				<ul><ol>{DIF || 'Test'}</ol></ul>
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
