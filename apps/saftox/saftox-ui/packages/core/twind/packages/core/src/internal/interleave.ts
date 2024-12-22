export function interleave<Interpolations extends string>(
  strings: TemplateStringsArray,
  interpolations: readonly Interpolations[],
  handle: (interpolation: Interpolations) => string,
): string {
  let result = strings[0] || '' // Start with the first string part

  interpolations.forEach((interpolation, index) => {
    const handledInterpolation = handle(interpolation) // Apply the handling function to each interpolation
    result += handledInterpolation + (strings[index + 1] || '') // Append the handled interpolation and the next string part
  })

  return result
}
