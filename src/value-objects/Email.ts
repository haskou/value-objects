import { InvalidEmailError } from '../errors/InvalidEmailError';
import { assert } from '../patterns/Assert';
import { NullObject } from './NullObject';
import { StringValueObject } from './StringValueObject';

export class Email extends StringValueObject {
  private static readonly PATTERN =
    /^[\w+\-.!#$%&'*=?^`{|}~]+@(?:[\w-]+\.)+(?:[a-zA-Z]{2,63}|xn--[a-zA-Z0-9-]{1,59})$/;

  constructor(value: string | StringValueObject) {
    super(value?.valueOf());

    if (NullObject.isNullObject(this)) {
      return this;
    }

    this.ensureIsValidEmail(this.value);
  }

  private ensureIsValidEmail(value: string): void {
    assert(Email.PATTERN.test(value), new InvalidEmailError(value));
  }
}
