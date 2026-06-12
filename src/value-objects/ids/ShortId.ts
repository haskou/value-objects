import { InvalidFormatError } from '../../errors/InvalidFormatError';
import { InvalidLengthError } from '../../errors/InvalidLengthError';
import { assert } from '../../patterns';
import { CryptoAdapter } from '../crypto/CryptoAdapter';
import { NullObject } from '../NullObject';
import { StringValueObject } from '../StringValueObject';
import { ValueObject } from '../ValueObject';

export class ShortId extends ValueObject<string> {
  private static readonly LENGTH = 24;
  private static readonly PATTERN = new RegExp(`[a-zA-Z0-9]{${this.LENGTH}}$`);

  private static generateObjectIdHex(): string {
    const bytes = CryptoAdapter.randomBytes(12);
    bytes.writeUInt32BE(Math.floor(Date.now() / 1000), 0);

    return bytes.toString('hex');
  }

  public static generate(): ShortId {
    return new ShortId(ShortId.generateObjectIdHex());
  }

  constructor(value: string | StringValueObject) {
    super(value?.valueOf());

    if (NullObject.isNullObject(this)) {
      return this;
    }
    this.ensureIsShortId(this.value);
  }

  private ensureIsShortId(value: string): void {
    assert(
      value.length === ShortId.LENGTH,
      new InvalidLengthError(this.value, ShortId.LENGTH),
    );
    assert(ShortId.PATTERN.test(value), new InvalidFormatError(this.value));
  }
}
