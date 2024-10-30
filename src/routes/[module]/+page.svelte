<script lang="ts">
	import { page } from '$app/stores';
	import { differences } from '../../lib/lesson/content/differences';
	import information from '$lib/lesson/content/info';
	import Icon from '$lib/icon.svelte';
	const module = $page.params.module as keyof typeof information;
	const subtitles = information[module];
</script>

<slot />
<article>
	<h2 style="text-transform: capitalize;">personal tweaks</h2>
	{#each subtitles as subtitle, i (i)}
		{@const tweaks = differences[module][i] || []}
		<section>
			<h3>{i + 1} ~ {subtitle}</h3>
			<ul style={!tweaks.length ? 'display: flex; justify-content: start;' : ''}>
				{#each tweaks as tweak, i2 (i2 + i)}
					<li style="list-style-type: '★'; padding: 1%;">{tweak}</li>
				{:else}
					<li style="list-style-type: '★'; padding: 1%;">
						<strong>Soon... </strong><Icon
							width={18}
							height={18}
							style={`transform: rotate(${(i + 3) * 0.25}turn)`}
						/>
					</li>
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
