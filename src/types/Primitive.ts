export type Primitive =
  | string
  | number
  | boolean
  | bigint
  | symbol
  | Record<string, unknown>
  | Array<unknown>
  | null
  | undefined;
