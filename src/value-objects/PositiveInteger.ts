import { InvalidPositiveNumberError } from '../errors/InvalidPositiveNumberError';
import { assert } from '../patterns/Assert';
import { Integer } from './Integer';
import { NullObject } from './NullObject';
import { NumberValueObject } from './NumberValueObject';

export class PositiveInteger extends Integer {
  constructor(value: number | NumberValueObject) {
    super(value?.valueOf());

    if (NullObject.isNullObject(this)) {
      return this;
    }
    assert(this.value >= 0, new InvalidPositiveNumberError());
  }
}
