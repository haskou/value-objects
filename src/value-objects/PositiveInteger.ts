import { InvalidIntegerError } from '../errors/InvalidIntegerError';
import { assert } from '../patterns/Assert';
import { NullObject } from './NullObject';
import { NumberValueObject } from './NumberValueObject';
import { PositiveNumber } from './PositiveNumber';

export class PositiveInteger extends PositiveNumber {
  constructor(value: number | NumberValueObject) {
    super(value?.valueOf());

    if (NullObject.isNullObject(this)) {
      return this;
    }
    assert(this.value % 1 === 0, new InvalidIntegerError(this.value));
  }
}
