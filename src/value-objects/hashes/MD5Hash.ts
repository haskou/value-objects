import crypto from 'node:crypto';

import { InvalidHashError } from '../../errors/InvalidHashError';
import { assert } from '../../patterns';
import { NullObject } from '../NullObject';
import { StringValueObject } from '../StringValueObject';
import { Hash } from './Hash';

export class MD5Hash extends Hash {
  public static isValid(hash: string | StringValueObject): boolean {
    return !!hash.valueOf().match(/^[a-f0-9]{32}$/);
  }

  public static from(buffer: Buffer | string | StringValueObject): MD5Hash {
    return new MD5Hash(
      crypto.createHash('md5').update(buffer.valueOf()).digest('hex'),
    );
  }

  constructor(source: string | StringValueObject) {
    super(source?.valueOf());

    if (NullObject.isNullObject(this)) {
      return this;
    }

    assert(
      MD5Hash.isValid(this.valueOf()),
      new InvalidHashError('MD5', source.valueOf()),
    );
  }
}
