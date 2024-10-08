/**
 * @satisfies {import('@sveltejs/kit').ParamMatcher}
 */
export function match(param: string): boolean {
	return [/^[1-9]$/,/^[1-5]\d$/,/^6[0-7]$/].some( regExp => regExp.test(param));
}