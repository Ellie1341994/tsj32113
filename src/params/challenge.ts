/**
 * @satisfies {import('@sveltejs/kit').ParamMatcher}
 */
export function match(param: string): boolean {
	return ['halloween', 'christmas'].some((challenge) => param === challenge);
}
