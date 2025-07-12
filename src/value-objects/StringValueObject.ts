import { InvalidStringLengthError } from '../errors/InvalidStringLengthError';
import { assert } from '../patterns/Assert';
import { NullObject } from '../patterns/NullObject';
import { ValueObject } from '../patterns/ValueObject';

export class StringValueObject extends ValueObject<string> {
  constructor(value: string | StringValueObject, maxLength: number = 512) {
    super(value?.valueOf());

    if (NullObject.isNullObject(this)) {
      return this;
    }

    this.ensureDoesNotExceedsMaxLength(maxLength);
  }

  private ensureDoesNotExceedsMaxLength(maxLength: number): void {
    assert(
      this.value.length <= maxLength,
      new InvalidStringLengthError(this.value, maxLength),
    );
  }

  public isEmpty(): boolean {
    return !this.value;
  }
}
