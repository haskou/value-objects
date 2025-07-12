import { InvalidEmailError } from '../errors/InvalidEmailError';
import { assert } from '../patterns/Assert';
import { NullObject } from '../patterns/NullObject';
import { StringValueObject } from './StringValueObject';

export class Email extends StringValueObject {
  constructor(value: string | StringValueObject) {
    super(value?.valueOf());

    if (NullObject.isNullObject(this)) {
      return this;
    }

    this.ensureIsValidEmail(this.value);
  }

  private ensureIsValidEmail(value: string): void {
    assert(
      new RegExp(/^[\w+\-.]+@(?:[\w-]+\.)+[a-zA-Z]{2,13}$/).test(value),
      new InvalidEmailError(value),
    );
  }
}
