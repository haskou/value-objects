import { Buffer } from 'buffer';

import { InvalidHashError } from '../../errors/InvalidHashError';
import { assert } from '../../patterns';
import { CryptoAdapter } from '../crypto/CryptoAdapter';
import { Media } from '../media/Media';
import { NullObject } from '../NullObject';
import { StringValueObject } from '../StringValueObject';
import { ValueObject } from '../ValueObject';

export class SHA512Hash extends ValueObject<string> {
  public static isValid(hash: string | StringValueObject): boolean {
    return !!hash.valueOf().match(/^[a-f0-9]{128}$/i);
  }

  public static from(
    buffer: string | StringValueObject | Media | Buffer,
  ): SHA512Hash {
    return new SHA512Hash(
      CryptoAdapter.hash(
        'sha512',
        buffer instanceof Media ? buffer.getBuffer() : buffer.valueOf(),
      ),
    );
  }

  constructor(source: string | StringValueObject) {
    super(source?.valueOf());

    if (NullObject.isNullObject(this)) {
      return this;
    }

    assert(
      SHA512Hash.isValid(this.valueOf()),
      new InvalidHashError('SHA512', source.valueOf()),
    );
  }

  public toBase64(): StringValueObject {
    return new StringValueObject(
      Buffer.from(this.valueOf(), 'hex').toString('base64'),
    );
  }
}
