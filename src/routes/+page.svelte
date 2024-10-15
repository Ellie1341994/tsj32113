<div>
	<h1>
		<a class="disabled-link" href="/">challenges</a>
	</h1>
	<h1><a href="/basics">projects</a></h1>
</div>

<style lang="scss">
	div {
		height: 100%;
		// width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-around;
		h1 {
			font-size: 4em;
			a {
				text-decoration: none;
				text-transform: uppercase;
				color: var(--color-theme-3);
				.disabled-link {
					pointer-events: none;
				}
				&:hover:not(.disabled-link) {
					text-shadow: #70577a 3px 4px 5px;
				}
			}
		}
	}
</style>
