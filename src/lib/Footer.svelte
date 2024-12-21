<script lang="ts">
	export let pathname: string = '';
	// const style = /challenges/.test(pathname) ? 'width: 100vw;  position: fixed; bottom: 0vh;' : ''
	const isChristmasChallenge = /christmas/.test(pathname);
	const isChallenge = /challenge/.test(pathname);
	const isProject = /\d{1,2}/.test(pathname);
	const isRoot = /\/$/.test(pathname);

	const style =
		isChallenge || isRoot
			? `width: 100vw;  position: fixed; bottom: 0vh; ${isChristmasChallenge ? 'color: white;' : ''}`
			: isProject
				? ''
				: 'visibility: hidden;';
</script>

<footer {style}>
	<p>
		Creative practices by <strong
			><a
				style={isChristmasChallenge ? 'color: white;' : 'color: black;'}
				href="https://x.com/0E11ie"
				target="_blank">Elian Broocks</a
			></strong
		>
	</p>
</footer>

<style>
	footer {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 10vh;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
