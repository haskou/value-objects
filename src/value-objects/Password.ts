import { InvalidPasswordError } from '../errors/InvalidPasswordError';
import { assert } from '../patterns';
import { NullObject } from './NullObject';
import { StringValueObject } from './StringValueObject';

export class Password extends StringValueObject {
  private static readonly MAX_LENGTH = 256;
  private static readonly MIN_LENGTH = 12;

  constructor(value: string | StringValueObject) {
    super(value);

    if (NullObject.isNullObject(this)) {
      return this;
    }

    assert(
      this.isValidPassword(),
      new InvalidPasswordError(Password.MIN_LENGTH, Password.MAX_LENGTH),
    );
  }

  private isValidPassword(): boolean {
    return (
      this.value.length >= Password.MIN_LENGTH &&
      this.value.length <= Password.MAX_LENGTH &&
      /[A-Z]/.test(this.value) &&
      /[a-z]/.test(this.value) &&
      /[0-9]/.test(this.value) &&
      /[^A-Za-z0-9]/.test(this.value)
    );
  }
}
