import { InvalidPositiveNumberError } from '../errors/InvalidPositiveNumberError';
import { assert } from '../patterns/Assert';
import { NullObject } from '../patterns/NullObject';
import { NumberValueObject } from './NumberValueObject';

export class PositiveNumber extends NumberValueObject {
  constructor(value: number | NumberValueObject) {
    super(value?.valueOf());

    if (NullObject.isNullObject(this)) {
      return this;
    }

    this.ensureIsPositive(this.value);
  }

  private ensureIsPositive(value: number): void {
    assert(value >= 0, new InvalidPositiveNumberError());
  }
}
