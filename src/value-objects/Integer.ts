import { InvalidIntegerError } from '../errors/InvalidIntegerError';
import { assert } from '../patterns/Assert';
import { NullObject } from '../patterns/NullObject';
import { NumberValueObject } from './NumberValueObject';

export class Integer extends NumberValueObject {
  constructor(value: number | NumberValueObject) {
    super(value?.valueOf());

    if (NullObject.isNullObject(this)) {
      return this;
    }
    this.ensureIsInteger();
  }

  private ensureIsInteger(): void {
    assert(
      this.value.valueOf() % 1 === 0,
      new InvalidIntegerError(this.value.valueOf()),
    );
  }
}
