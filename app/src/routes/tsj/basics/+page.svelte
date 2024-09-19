<script>
	import { page } from '$app/stores';
</script>

<div style="margin: 0%; height: fit-content; width: 100%;">
	<ul
		style="list-style-type: none; display: flex; flex-wrap: wrap; flex-direction:row; width: 100%%;"
	>
		{#each [...Array(13).keys()] as index (index)}
			{@const lesson = index + 1}
			<li
				style="background-color:black; border: 1vh solid black; flex-wrap: wrap; border-radius: 10%; margin: 1%;"
				aria-current={$page.url.pathname === '/tsj/basics' ? 'page' : undefined}
			>
				<a
					style="font-size: 5em; display: block; color: white; padding: 5vw;"
					href="/tsj/basics/{lesson}">{lesson}</a
				>
			</li>
		{/each}
	</ul>
</div>
