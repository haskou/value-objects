import { InvalidDayError } from '../../errors/InvalidDayError';
import { assert } from '../../patterns/Assert';
import { Integer } from '../Integer';
import { NullObject } from '../NullObject';
import { NumberValueObject } from '../NumberValueObject';

export class Day extends Integer {
  constructor(value: number | NumberValueObject) {
    super(value?.valueOf());

    if (NullObject.isNullObject(this)) {
      return this;
    }

    this.ensureIsValidDay();
  }

  private ensureIsValidDay(): void {
    assert(this.isGreaterOrEqualThan(1), new InvalidDayError(this.value));
    assert(this.isLessOrEqualThan(31), new InvalidDayError(this.value));
  }
}
