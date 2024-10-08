/**
 * @satisfies {import('@sveltejs/kit').ParamMatcher}
 */
export function match(param: string): boolean {
	return ['basics','advanced_techniques', 'classic_techniques', 'shaders', 'extra'].some( module => param === module);
}