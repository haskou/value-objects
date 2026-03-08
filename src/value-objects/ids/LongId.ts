import { v4 } from 'uuid';

import { InvalidFormatError } from '../../errors/InvalidFormatError';
import { InvalidLengthError } from '../../errors/InvalidLengthError';
import { assert } from '../../patterns';
import { NullObject } from '../NullObject';
import { StringValueObject } from '../StringValueObject';
import { ValueObject } from '../ValueObject';

export class LongId extends ValueObject<string> {
  private static readonly LENGTH = 36;
  private static readonly PATTERN = new RegExp(`^[a-z0-9-]{${this.LENGTH}}$`);

  public static generate(): LongId {
    return new LongId(v4());
  }

  constructor(value: string | StringValueObject) {
    super(value.valueOf());

    if (NullObject.isNullObject(this)) {
      return this;
    }
    this.ensureIsLongId(this.value);
  }

  private ensureIsLongId(value: string): void {
    assert(
      value.length === LongId.LENGTH,
      new InvalidLengthError(this.value, LongId.LENGTH),
    );
    assert(LongId.PATTERN.test(value), new InvalidFormatError(this.value));
  }
}
