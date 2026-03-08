import { createHash } from 'crypto';

import { InvalidHashError } from '../../errors/InvalidHashError';
import { assert } from '../../patterns';
import { NullObject } from '../NullObject';
import { StringValueObject } from '../StringValueObject';
import { ValueObject } from '../ValueObject';

export class SHA256Hash extends ValueObject<string> {
  public static isValid(hash: string | StringValueObject): boolean {
    return !!hash.valueOf().match(/^[a-f0-9]{64}$/i);
  }

  public static from(buffer: Buffer | string | StringValueObject): SHA256Hash {
    return new SHA256Hash(
      createHash('sha256').update(buffer.valueOf()).digest('hex'),
    );
  }

  constructor(source: string | StringValueObject) {
    super(source?.valueOf());

    if (NullObject.isNullObject(this)) {
      return this;
    }

    assert(
      SHA256Hash.isValid(this.valueOf()),
      new InvalidHashError('SHA256', source.valueOf()),
    );
  }

  public toBase64(): StringValueObject {
    return new StringValueObject(
      Buffer.from(this.valueOf(), 'hex').toString('base64'),
    );
  }
}
