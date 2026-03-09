import { InvalidSignatureError } from '../../errors/InvalidSignatureError';
import { assert } from '../../patterns';
import { NullObject } from '../NullObject';
import { StringValueObject } from '../StringValueObject';
import { ValueObject } from '../ValueObject';

// TODO: Test
export class Signature extends ValueObject<string> {
  private static readonly LENGTH = 88;
  private static readonly PATTERN = /^[A-Za-z0-9+/]{86}==$/;

  public static fromBuffer(buffer: Buffer): Signature {
    return new Signature(buffer.toString('base64'));
  }

  constructor(value: string | StringValueObject) {
    super(value?.valueOf());

    if (NullObject.isNullObject(this)) {
      return this;
    }

    assert(this.hasValidFormat(), new InvalidSignatureError(Signature.LENGTH));
  }

  private hasValidFormat(): boolean {
    return Signature.PATTERN.test(this.value);
  }
}
