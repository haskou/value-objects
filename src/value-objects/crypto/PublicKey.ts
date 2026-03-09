import { ed25519, x25519 } from '@noble/curves/ed25519.js';
import * as crypto from 'node:crypto';

import { InvalidFormatError } from '../../errors/InvalidFormatError';
import { InvalidLengthError } from '../../errors/InvalidLengthError';
import { assert } from '../../patterns';
import { NullObject } from '../NullObject';
import { StringValueObject } from '../StringValueObject';
import { CryptoPayload } from './CryptoPayload';
import { EncryptedPayload } from './EncryptedPayload';
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

  public encrypt(payload: CryptoPayload): EncryptedPayload {
    const messageBuffer = Buffer.from(payload.valueOf());

    const spkiDer = crypto
      .createPublicKey(this.valueOf())
      .export({ format: 'der', type: 'spki' });
    const x25519Pub = ed25519.utils.toMontgomery(spkiDer.subarray(12));

    const ephemeralPriv = x25519.utils.randomSecretKey();
    const ephemeralPub = x25519.getPublicKey(ephemeralPriv);
    const sharedSecret = x25519.getSharedSecret(ephemeralPriv, x25519Pub);

    const aesKey = crypto
      .createHash('sha256')
      .update(sharedSecret)
      .update(ephemeralPub)
      .digest();

    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', aesKey, iv);
    const cipherText = Buffer.concat([
      cipher.update(messageBuffer),
      cipher.final(),
    ]);
    const tag = cipher.getAuthTag();

    const result = [
      Buffer.from(ephemeralPub).toString('base64'),
      iv.toString('base64'),
      cipherText.toString('base64'),
      tag.toString('base64'),
    ].join('.');

    return new EncryptedPayload(result);
  }
}
