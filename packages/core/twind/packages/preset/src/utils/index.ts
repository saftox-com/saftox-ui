// https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore?tab=readme-ov-file#_mapKeys
export const mapKeys = <T, U>(
	object: Record<string, T>,
	cb: (value: T, key: string, obj: Record<string, T>) => string,
): Record<string, T> =>
	Object.entries(object).reduce<Record<string, T>>((acc, [key, value]) => {
		const newKey = cb(value, key, object);
		acc[newKey] = value;
		return acc;
	}, {});

const KEBAB_REGEX = /[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g;
const REVERSE_REGEX = /-[a-z\u00E0-\u00F6\u00F8-\u00FE]/g;

export const kebabCase = (str: string) => {
	return str.replace(KEBAB_REGEX, (match) => {
		return `-${match.toLowerCase()}`;
	});
};

export const kebabCaseReverse = (str: string) => {
	return str.replace(REVERSE_REGEX, (match) => {
		return match.slice(1).toUpperCase();
	});
};
