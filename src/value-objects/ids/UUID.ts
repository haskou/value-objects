import { InvalidFormatError } from '../../errors/InvalidFormatError';
import { InvalidLengthError } from '../../errors/InvalidLengthError';
import { assert } from '../../patterns';
import { CryptoAdapter } from '../crypto/CryptoAdapter';
import { NullObject } from '../NullObject';
import { StringValueObject } from '../StringValueObject';
import { ValueObject } from '../ValueObject';

export class UUID extends ValueObject<string> {
  private static readonly LENGTH = 36;
  private static readonly PATTERN =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  private static readonly SENTINEL_PATTERN =
    /^(?:00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/i;

  private static fromRandomBytes(bytes: Buffer): string {
    const uuidBytes = Buffer.from(bytes);
    uuidBytes[6] = (uuidBytes[6] % 16) + 64;
    uuidBytes[8] = (uuidBytes[8] % 64) + 128;

    const hex = uuidBytes.toString('hex');

    return [
      hex.slice(0, 8),
      hex.slice(8, 12),
      hex.slice(12, 16),
      hex.slice(16, 20),
      hex.slice(20),
    ].join('-');
  }

  public static generate(): UUID {
    return new UUID(UUID.fromRandomBytes(CryptoAdapter.randomBytes(16)));
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
