import { Primitive } from './Primitive';

export type SerializedValue =
  | Primitive
  | SerializedValue[]
  | {
      [key: string]: SerializedValue;
    };
