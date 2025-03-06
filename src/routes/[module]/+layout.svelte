<script lang="ts">
	import { page } from '$app/state';
	let { children } = $props();
	import Header from '../../lib/Header.svelte';
	const module = $derived(page.params.module) as keyof typeof information;
	const lesson = $derived(parseInt(page.params.lesson));
	import { goto } from '$app/navigation';
	// import { browser } from '$app/environment';
	import information from '$lib/lesson/content/info';
	import { lessonGroupIndexes } from '$lib/lessonGroupIndexes';
	import { onMount } from 'svelte';
	onMount(() => {
		function redirect() {
			console.log('redirection on');
			if (!lesson) {
				const dif =
					lessonGroupIndexes[module].endLessonIndex - lessonGroupIndexes[module].startLessonIndex;
				const randomIndex =
					lessonGroupIndexes[module].startLessonIndex + Math.floor(Math.random() * dif);

				goto(`/${module}/${randomIndex}`);
			}
		}
		let intervalExitCode = setInterval(redirect, 250);
		return () => clearInterval(intervalExitCode);
	});
</script>

{#key module || lesson}
	<Header {lesson} {module} />

	<main>
		{@render children()}
	</main>
{/key}

<style>
	main {
		/* flex: 1; */
		display: flex;
		flex-direction: column;
		/* padding: 0%; */
		width: 100vw;
		height: 75vh;
		/* margin: 0 auto; */
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
	}
</style>
