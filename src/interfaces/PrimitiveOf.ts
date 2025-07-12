import { Primitive } from '../types/Primitive';

export type PrimitiveOf<
  T extends { toPrimitives(): Primitive | Record<string, Primitive> },
> = ReturnType<T['toPrimitives']>;
