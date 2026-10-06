import { InvalidFormatError } from '../../errors/InvalidFormatError';
import { InvalidLengthError } from '../../errors/InvalidLengthError';
import { assert } from '../../patterns';
import { NullObject } from '../NullObject';
import { StringValueObject } from '../StringValueObject';
import { ValueObject } from '../ValueObject';

export class ShortId extends ValueObject<string> {
  private static readonly LENGTH = 24;
  private static readonly PATTERN = new RegExp(`[a-zA-Z0-9]{${this.LENGTH}}$`);

  private static generateObjectIdHex(): string {
    const bytes = new Uint8Array(12);
    new DataView(bytes.buffer).setUint32(0, Math.floor(Date.now() / 1000));
    bytes.set(globalThis.crypto.getRandomValues(new Uint8Array(8)), 4);

    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join(
      '',
    );
  }

  public static generate<T extends ShortId = ShortId>(
    this: new (value: string) => T,
  ): T {
    return new this(ShortId.generateObjectIdHex());
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
