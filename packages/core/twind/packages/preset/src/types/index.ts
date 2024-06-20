export type Simplify<T> = {
  [P in keyof T]: T[P] extends boolean | 'true' | 'false' ? boolean : T[P]
}
