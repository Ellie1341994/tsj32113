<script lang="ts">
	import { page } from '$app/stores';
	import { lessonGroupIndexes } from '$lib/lessonGroupIndexes';
	$: isHomepage = /tsj$/.test($page.url.pathname);
	$: currentLessonId = isHomepage ? null : $page.params.page || '';
	$: currentLessonGroup = isHomepage
		? null
		: ($page.url.pathname.split('/')[2]?.replace(/_/, ' ') as
				| 'basics'
				| 'classic techniques'
				| 'advanced techniques');
	$: isBasicPath = /\/tsj\/basics/.test($page.url.pathname);
	$: isClassicPath = /\/tsj\/classic_techniques/.test($page.url.pathname);
	$: isAdvancedPath = /\/tsj\/advanced_techniques/.test($page.url.pathname);
	$: lessonIds = isHomepage
		? []
		: [...Array(67).keys()].slice(
				lessonGroupIndexes[currentLessonGroup!].startLessonIndex,
				lessonGroupIndexes[currentLessonGroup!].endLessonIndex
			);
	// console.log($page.route);
	$: titleMsg =
		'T.S.J. ' +
		`${isHomepage ? '' : lessonGroupIndexes[currentLessonGroup!].shorthand + currentLessonId}`;
</script>

<svelte:head>
	<title>{titleMsg}</title>
	<link rel="icon" href="../../src/lib/icon.svg" type="image/x-icon" />
	<meta
		name={`${currentLessonGroup} lesson `}
		content={`${currentLessonGroup} lesson ${currentLessonId || ''}`}
	/>
</svelte:head>

<header>
	<nav class="main-nav">
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
		</svg>
		<ul>
			<li aria-current={isBasicPath ? 'page' : undefined}>
				<a href="/tsj/basics/">Basic</a>
			</li>
			<li aria-current={isClassicPath ? 'page' : undefined}>
				<a href="/tsj/classic_techniques/">Classic Techniques</a>
			</li>
			<li aria-current={isAdvancedPath ? 'page' : undefined}>
				<a href="/tsj/advanced_techniques/">Advanced Techniques</a>
			</li>
		</ul>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
		</svg>
	</nav>
	{#if currentLessonGroup}
		<nav class="sub-nav">
			<ul style="list-style-type: none; display: flex; padding: 0; width: 100%%;">
				{#each lessonIds as lessonId (lessonId)}
					{@const active = `${lessonId}` === currentLessonId}
					<li
						class="lesson-link-container"
						aria-current={$page.url.pathname === '/tsj/basics' ? 'page' : undefined}
					>
						{#if lessonId % 2}
							<a
								aria-disabled={!active}
								class={`lesson-link ${active ? 'current' : ''}`}
								href="/tsj/{currentLessonGroup.replace(/ /, '_')}/{lessonId}"
								><sup>{lessonId}</sup></a
							>
						{:else}
							<a
								aria-disabled={!active}
								class={`lesson-link ${active ? 'current' : ''}`}
								href="/tsj/{currentLessonGroup.replace(/ /, '_')}/{lessonId}"
								><sub>{lessonId}</sub></a
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
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		height: 20vh;
		padding: 0;
		margin: 0;
	}
	nav.sub-nav {
		height: 100%;
		li.lesson-link-container {
			background-color: transparent;
			flex-wrap: wrap;
			width: 35px;
			padding: 9px;
			margin: 0%;
			text-align: center;
		}
		a.lesson-link {
			font-size: 27px;
			text-align: center;
			color: white;
			padding: 0vw;
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
		justify-content: center;
		--background: rgba(255, 255, 255, 0.7);
		svg {
			width: 2em;
			height: 3em;
			display: block;
		}

		path {
			fill: var(--background);
		}

		ul {
			position: relative;
			padding: 0;
			margin: 0;
			height: 3em;
			display: flex;
			justify-content: center;
			align-items: center;
			list-style: none;
			background: var(--background);
			background-size: contain;
		}

		li {
			position: relative;
			height: 100%;
		}

		li[aria-current='page']::before {
			--size: 6px;
			content: '';
			width: 0;
			height: 0;
			position: absolute;
			top: 0;
			left: calc(50% - var(--size));
			border: var(--size) solid transparent;
			border-top: var(--size) solid var(--color-theme-3);
		}
		a {
			display: flex;
			height: 100%;
			align-items: center;
			padding: 0 0.5rem;
			color: var(--color-text);
			font-weight: 700;
			font-size: 0.8rem;
			text-transform: uppercase;
			letter-spacing: 0.1em;
			text-decoration: none;
			transition: color 0.2s linear;
		}
		a:hover {
			color: var(--color-theme-3);
		}
	}
</style>
