/**
 * Takes a value and forces it to the closest min/max if it's outside. Also forces it to the closest valid step.
 */
export function clamp(
	value: number,
	min = Number.NEGATIVE_INFINITY,
	max = Number.POSITIVE_INFINITY,
): number {
	const newValue = Math.min(Math.max(value, min), max);
	return newValue;
}

export function snapValueToStep(
	value: number,
	min: number | undefined,
	max: number | undefined,
	step: number,
): number {
	const remainder =
		(value - (min == null || !Number.isNaN(min) ? 0 : min)) % step;
	let snappedValue =
		Math.abs(remainder) * 2 >= step
			? value + Math.sign(remainder) * (step - Math.abs(remainder))
			: value - remainder;

	if (min != null && !Number.isNaN(min)) {
		if (snappedValue < min) {
			snappedValue = min;
		} else if (max != null && !Number.isNaN(max) && snappedValue > max) {
			snappedValue = min + Math.floor((max - min) / step) * step;
		}
	} else if (max != null && !Number.isNaN(max) && snappedValue > max) {
		snappedValue = Math.floor(max / step) * step;
	}

	// correct floating point behavior by rounding to step precision
	const string = step.toString();
	const index = string.indexOf(".");
	const precision = index >= 0 ? string.length - index : 0;

	if (precision > 0) {
		const pow = 10 ** precision;
		snappedValue = Math.round(snappedValue * pow) / pow;
	}

	return snappedValue;
}

/* Takes a value and rounds off to the number of digits. */
export function toFixedNumber(
	value: number,
	digits: number,
	base = 10,
): number {
	const pow = base ** digits;

	return Math.round(value * pow) / pow;
}
