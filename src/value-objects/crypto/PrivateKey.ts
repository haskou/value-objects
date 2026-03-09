import * as crypto from 'node:crypto';

import { InvalidFormatError } from '../../errors/InvalidFormatError';
import { InvalidLengthError } from '../../errors/InvalidLengthError';
import { assert } from '../../patterns';
import { NullObject } from '../NullObject';
import { StringValueObject } from '../StringValueObject';
import { CryptoPayload } from './CryptoPayload';
import { Key } from './Key';
import { Signature } from './Signature';

export class PrivateKey extends Key {
  private static readonly LENGTH = 119;
  private static readonly PATTERN =
    /^-----BEGIN PRIVATE KEY-----\n[A-Za-z0-9+/=]+\n-----END PRIVATE KEY-----\n$/;

  public static fromPEM(pem: string | StringValueObject): PrivateKey {
    return new PrivateKey(pem.valueOf());
  }

  constructor(value: string | StringValueObject) {
    super(value?.valueOf());

    if (NullObject.isNullObject(this)) {
      return this;
    }

    this.ensureIsValidPrivateKey(this.value);
  }

  private ensureIsValidPrivateKey(value: string): void {
    assert(
      value.length === PrivateKey.LENGTH,
      new InvalidLengthError(value, PrivateKey.LENGTH),
    );
    assert(PrivateKey.PATTERN.test(value), new InvalidFormatError(value));
  }

  public sign(payload: CryptoPayload): Signature {
    const messageBuffer = Buffer.from(payload.valueOf());
    const signatureBuffer = crypto.sign(null, messageBuffer, this.valueOf());

    return Signature.fromBuffer(signatureBuffer);
  }
}
