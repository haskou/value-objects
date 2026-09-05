import { Primitive } from '../types/Primitive';

type SerializedValue =
  | Primitive
  | SerializedValue[]
  | {
      [key: string]: SerializedValue;
    };

export type PrimitiveOf<T extends { toPrimitives(): SerializedValue }> =
  ReturnType<T['toPrimitives']>;
