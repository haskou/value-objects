import { InvalidHashError } from '../../errors/InvalidHashError';
import { assert } from '../../patterns';
import { NullObject } from '../NullObject';
import { StringValueObject } from '../StringValueObject';
import { Hash } from './Hash';

export class SHA512Hash extends Hash {
  public static isValid(hash: string | StringValueObject): boolean {
    return !!hash.valueOf().match(/^[a-f0-9]{128}$/i);
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
}
