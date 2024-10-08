<script lang="ts">
	import { page } from '$app/stores';
	import { differences } from '../../../lib/lesson/content/differences';
	import information from '$lib/lesson/content/info';
	const module = $page.params.module as keyof typeof information;
	const subtitles = information[module];
</script>

<slot />
<article>
	<h1 style="text-transform: capitalize;">personal tweaks</h1>
	{#each subtitles as subtitle, i (subtitles)}
		<section>
			<h3>{i + 1} ~ {subtitle}</h3>
			<ul>
				{#each differences[module][i] as tweak (tweak)}
					<li style="list-style-type: '★'; padding: 1%;">{tweak}</li>
				{:else}
					Empty
				{/each}
			</ul>
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
