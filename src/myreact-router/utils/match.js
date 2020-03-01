import pathToRegexp from 'path-to-regexp';

const cache = {};
const cacheLimit = 10000;
let cacheCount = 0;

export function complilePath(path, options) {
	const cacheKey = `${options.end}${options.strict}${options.senstive}`;
	const pathCache = cache[cacheKey] || (cache[cacheKey] = {});

	if (pathCache[path]) return pathCache[path];

	const keys = [];
	const regexp = pathToRegexp(path, keys, options);
	const result = { regexp, keys };

	if (cacheCount < cacheLimit) {
		pathCache[path] = result;
		cacheCount++;
	}
	return result;
}

// pathname="/bar/tony"
// options={
//   path: "/foo",
//   component: () => {…}
// }
export function matchPath(pathname, options = {}) {
	if (typeof options === 'string') options = { path: options };

	const { path, exact = false, strict = false, senstive = false } = options;
	const paths = [].concat(path);

	return paths.reduce((matched, path) => {
		if (!path) return null;
		if (matched) return matched;

		const { regexp, keys } = complilePath(path, {
			end: exact,
			strict,
			senstive
		});

		const match = regexp.exec(pathname);

		if (!match) return null;

		const [url, ...values] = match;
		const isExact = pathname === url;

		if (exact && !isExact) return null;

		return {
			path,
			url: path === "/" && url === "" ? "/" : url,
			isExact,
			params: keys.reduce((memo, key, index) => {
				memo[key.name] = values[index];
				return memo;
			}, {})
		};
	}, null);
}
