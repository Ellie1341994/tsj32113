<script lang="ts">
	import { lessonGroupIndexes } from '$lib/lessonGroupIndexes';
	export let module: keyof typeof lessonGroupIndexes;
	export let lesson: number;

	let { startLessonIndex, endLessonIndex } = lessonGroupIndexes[module] || {};

	let lessonIds = module && [...Array(67).keys()].slice(startLessonIndex, endLessonIndex);
</script>

<header>
	<nav class="main-nav">
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
		</svg>
		<ul>
			<li aria-current={/basics/.test(module) ? 'page' : undefined}>
				<a href="/basics/">Basic</a>
			</li>
			<li aria-current={/classic_techniques/.test(module) ? 'page' : undefined}>
				<a href="/classic_techniques/">Classic</a>
			</li>
			<li aria-current={/advanced_techniques/.test(module) ? 'page' : undefined}>
				<a href="/advanced_techniques/">Advanced</a>
			</li>
			<!-- <li aria-current={/shaders/.test(module) ? 'page' : undefined}>
				<a href="/shaders/">Shaders</a>
			</li>
			<li aria-current={/extra/.test(module) ? 'page' : undefined}>
				<a href="/extra/">Extra</a> -->
			<!-- </li> -->
		</ul>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
		</svg>
	</nav>
	{#if module}
		<nav class="sub-nav">
			<ul style="list-style-type: none; display: flex; padding: 0; width: 100%%;">
				{#each lessonIds as lessonId (lessonId)}
					{@const active = lessonId === lesson}
					<li class="lesson-link-container" aria-current={lesson === lessonId ? 'page' : undefined}>
						{#if lessonId % 2}
							<a
								aria-disabled={!active}
								class={`lesson-link ${active ? 'current' : ''}`}
								href="/{module.replace(/ /, '_')}/{lessonId}"
							>
								<sup>{lessonId}</sup>
							</a>
						{:else}
							<a
								aria-disabled={!active}
								href="/{module.replace(/ /, '_')}/{lessonId}"
								class={`lesson-link ${active ? 'current' : ''}`}
							>
								<sub>{lessonId}</sub></a
							>
						{/if}
					</li>
				{/each}
			</ul>
		</nav>
	{/if}
</header>

<style lang="scss">
	header {
		// display: flex;
		// flex: none;
		// flex-direction: column;
		// align-items: center;
		// justify-content: space-between;
		height: 15vh;
		padding: 0;
	}
	nav.sub-nav {
		height: 10vh;
		// overflow: scroll;
		// width: 100%;
		flex: none;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0;
		margin: 0vh 0vh;
		ul {
			margin: 0;
			padding: 0;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		// box-sizing: content-box;
		li.lesson-link-container {
			background-color: transparent;
			flex-wrap: wrap;
			width: 35px;
			padding: 1vh;
			// height: 75%;
			margin: 0%;
			text-align: center;
		}
		a.lesson-link {
			font-size: 27px;
			text-align: center;
			color: white;
			padding: 1vh 0;
			text-decoration: none;
		}
		li:has(a.lesson-link.current) {
			/* border-left: 1px solid var(--color-theme-1); */
			border-bottom: 6px solid var(--color-theme-3);
			border-top: 6px solid var(--color-theme-3);
			border-radius: 25%;
			pointer-events: none;
		}

		a:hover:not(.current) {
			color: var(--color-theme-3);
		}
	}

	nav.main-nav {
		display: flex;
		flex: none;
		justify-content: center;
		height: 5vh;
		width: 100%;
		--background: rgba(235, 235, 235, 1);
		margin: 0;
		padding: 0;
		svg {
			// width: auto;
			height: 5vh;
			// margin: 0;
			// padding: 0 0 0 1rem;
			// display: flex;
		}

		path {
			fill: var(--background);
		}

		ul {
			position: relative;
			padding: 0;
			margin: 0;
			height: 5vh;
			display: flex;
			justify-content: center;
			align-items: center;
			list-style: none;
			background: var(--background);
			background-size: contain;
			z-index: 1;
		}

		li {
			position: relative;
			height: 100%;
			margin: 0;
			padding: 0 0 0 1rem;
		}

		li[aria-current='page']::before {
			--size: 6px;
			content: '';
			width: 0;
			height: 0;
			position: absolute;
			margin: 0;
			padding: 0;
			top: 0;
			left: calc(50% - var(--size));
			border: var(--size) solid transparent;
			border-top: var(--size) solid var(--color-theme-3);
		}
		a {
			display: flex;
			height: 100%;
			align-items: center;
			// padding-right: 3rem;
			color: var(--color-text);
			font-weight: 700;
			font-size: 0.8rem;
			text-transform: uppercase;
			letter-spacing: 0.1em;
			text-decoration: none;

			transition: color 0.2s linear;
			// &.disabled {
			// 	pointer-events: none;
			// }
		}
		a:hover {
			color: var(--color-theme-3);
		}
	}
</style>
