/**
 * @satisfies {import('@sveltejs/kit').ParamMatcher}
 */
export function match(param: string): boolean {
	return ['halloween'].some( challenge => param === challenge);
}