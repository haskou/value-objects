import { SerializedValue } from '../types/SerializedValue';

export type PrimitiveOf<T extends { toPrimitives(): SerializedValue }> =
  ReturnType<T['toPrimitives']>;
