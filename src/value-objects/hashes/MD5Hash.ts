import { InvalidHashError } from '../../errors/InvalidHashError';
import { assert } from '../../patterns';
import { NullObject } from '../NullObject';
import { StringValueObject } from '../StringValueObject';
import { Hash } from './Hash';

export class MD5Hash extends Hash {
  public static isValid(hash: string | StringValueObject): boolean {
    return !!hash.valueOf().match(/^[a-f0-9]{32}$/);
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
