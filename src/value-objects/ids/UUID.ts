import { v4 } from 'uuid';

import { InvalidFormatError } from '../../errors/InvalidFormatError';
import { InvalidLengthError } from '../../errors/InvalidLengthError';
import { assert } from '../../patterns';
import { NullObject } from '../NullObject';
import { StringValueObject } from '../StringValueObject';
import { ValueObject } from '../ValueObject';

export class UUID extends ValueObject<string> {
  private static readonly LENGTH = 36;
  private static readonly PATTERN = new RegExp(`^[a-z0-9-]{${this.LENGTH}}$`);

  public static generate(): UUID {
    return new UUID(v4());
  }

  constructor(value: string | StringValueObject) {
    super(value.valueOf());

    if (NullObject.isNullObject(this)) {
      return this;
    }
    this.ensureIsUUID(this.value);
  }

  private ensureIsUUID(value: string): void {
    assert(
      value.length === UUID.LENGTH,
      new InvalidLengthError(this.value, UUID.LENGTH),
    );
    assert(UUID.PATTERN.test(value), new InvalidFormatError(this.value));
  }
}
