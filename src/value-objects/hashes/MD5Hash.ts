import { Buffer } from 'buffer';

import { InvalidHashError } from '../../errors/InvalidHashError';
import { assert } from '../../patterns';
import { BrowserCrypto } from '../crypto/BrowserCrypto';
import { Media } from '../media/Media';
import { NullObject } from '../NullObject';
import { StringValueObject } from '../StringValueObject';
import { Hash } from './Hash';

export class MD5Hash extends Hash {
  public static isValid(hash: string | StringValueObject): boolean {
    return !!hash.valueOf().match(/^[a-f0-9]{32}$/);
  }

  public static from(
    buffer: string | StringValueObject | Media | Buffer,
  ): MD5Hash {
    return new MD5Hash(BrowserCrypto.hash('md5', buffer.valueOf()));
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
