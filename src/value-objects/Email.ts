import { InvalidEmailError } from '../errors/InvalidEmailError';
import { assert } from '../patterns/Assert';
import { NullObject } from './NullObject';
import { StringValueObject } from './StringValueObject';

export class Email extends StringValueObject {
  private static readonly MAX_LENGTH = 254;
  private static readonly PATTERN =
    /^[\w+\-.!#$%&'*/=?^`{|}~]{1,64}@(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+(?:[a-z]{2,63}|xn--[a-z0-9](?:[a-z0-9-]{0,57}[a-z0-9])?)$/i;

  constructor(value: string | StringValueObject) {
    super(value?.valueOf(), Email.MAX_LENGTH);

    if (NullObject.isNullObject(this)) {
      return this;
    }

    this.ensureIsValidEmail(this.value);
  }

  private ensureIsValidEmail(value: string): void {
    assert(Email.PATTERN.test(value), new InvalidEmailError(value));
  }
}
