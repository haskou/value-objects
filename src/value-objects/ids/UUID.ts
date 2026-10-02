import { InvalidFormatError } from '../../errors/InvalidFormatError';
import { InvalidLengthError } from '../../errors/InvalidLengthError';
import { assert } from '../../patterns';
import { NullObject } from '../NullObject';
import { StringValueObject } from '../StringValueObject';
import { ValueObject } from '../ValueObject';

export class UUID extends ValueObject<string> {
  private static readonly LENGTH = 36;
  private static readonly PATTERN =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  private static readonly SENTINEL_PATTERN =
    /^(?:00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/i;

  public static generate(): UUID {
    const bytes = globalThis.crypto.getRandomValues(new Uint8Array(16));
    // RFC 4122 §4.4: version 4 and variant 10xx.
    bytes[6] = (bytes[6] % 16) + 64;
    bytes[8] = (bytes[8] % 64) + 128;
    const hex = Array.from(bytes, (byte) =>
      byte.toString(16).padStart(2, '0'),
    ).join('');

    return new UUID(
      [
        hex.slice(0, 8),
        hex.slice(8, 12),
        hex.slice(12, 16),
        hex.slice(16, 20),
        hex.slice(20),
      ].join('-'),
    );
  }

  constructor(value: string | StringValueObject) {
    super(value?.valueOf());

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
    assert(
      UUID.PATTERN.test(value) || UUID.SENTINEL_PATTERN.test(value),
      new InvalidFormatError(this.value),
    );
  }
}
