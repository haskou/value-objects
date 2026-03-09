import * as crypto from 'node:crypto';

import { InvalidFormatError } from '../../errors/InvalidFormatError';
import { InvalidLengthError } from '../../errors/InvalidLengthError';
import { assert } from '../../patterns';
import { NullObject } from '../NullObject';
import { StringValueObject } from '../StringValueObject';
import { CryptoPayload } from './CryptoPayload';
import { Key } from './Key';
import { Signature } from './Signature';

export class PublicKey extends Key {
  private static readonly LENGTH = 113;
  private static readonly PATTERN =
    /^-----BEGIN PUBLIC KEY-----\n[A-Za-z0-9+/=]+\n-----END PUBLIC KEY-----\n$/;

  public static fromPEM(pem: string | StringValueObject): PublicKey {
    return new PublicKey(pem.valueOf());
  }

  constructor(value: string | StringValueObject) {
    super(value?.valueOf());

    if (NullObject.isNullObject(this)) {
      return this;
    }

    this.ensureIsValidPublicKey(this.value);
  }

  private ensureIsValidPublicKey(value: string): void {
    assert(
      value.length === PublicKey.LENGTH,
      new InvalidLengthError(value, PublicKey.LENGTH),
    );
    assert(PublicKey.PATTERN.test(value), new InvalidFormatError(value));
  }

  public isValidSignature(
    payload: CryptoPayload,
    signature: Signature,
  ): boolean {
    const messageBuffer = Buffer.from(payload.valueOf());
    const signatureBuffer = Buffer.from(signature.valueOf(), 'base64');
    const valid = crypto.verify(
      null,
      messageBuffer,
      this.valueOf(),
      signatureBuffer,
    );

    return valid;
  }
}
