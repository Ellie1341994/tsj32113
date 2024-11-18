<div>
	<h1>
		<a class="" href="/challenges"> Challenge <sup>Projects</sup> </a>
	</h1>
	<h1><a href="/basics">Lesson<sub>Practices</sub> </a></h1>
</div>

<style lang="scss">
	div {
		height: 100%;
		// width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-around;
		h1 {
			font-size: min(5vh, 5vw);
			a {
				text-decoration: none;
				text-transform: capitalize;
				color: var(--color-theme-3);
				sub,
				sup {
					color: var(--color-text);
				}

				&:hover:not(.disabled-link) {
					--shadow-color: white;
					text-shadow:
						0vh 0vh 0.1vh #000,
						0vh 0vh 10vh var(--shadow-color),
						0vh 0vh 10vh var(--shadow-color),
						0vh 0vh 10vh var(--shadow-color),
						0vh 0vh 15vh var(--shadow-color),
						0vh 0vh 20vh var(--shadow-color),
						0vh 0vh 25vh var(--shadow-color);
				}
			}
		}
	}
</style>
