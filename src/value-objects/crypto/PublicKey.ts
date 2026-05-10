import { Buffer } from 'buffer';

import { InvalidFormatError } from '../../errors/InvalidFormatError';
import { InvalidLengthError } from '../../errors/InvalidLengthError';
import { assert } from '../../patterns';
import { NullObject } from '../NullObject';
import { StringValueObject } from '../StringValueObject';
import { CryptoAdapter } from './CryptoAdapter';
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
    const valid = CryptoAdapter.verify(
      signatureBuffer,
      messageBuffer,
      this.valueOf(),
    );

    return valid;
  }

  public encrypt(payload: CryptoPayload): EncryptedPayload {
    const messageBuffer = Buffer.from(payload.valueOf());

    const x25519Pub = CryptoAdapter.publicKeyToX25519(this.valueOf());

    const ephemeralPriv = CryptoAdapter.x25519RandomPrivateKey();
    const ephemeralPub = CryptoAdapter.x25519PublicKey(ephemeralPriv);
    const sharedSecret = CryptoAdapter.x25519SharedSecret(
      ephemeralPriv,
      x25519Pub,
    );

    const aesKey = CryptoAdapter.deriveEncryptionKey(
      sharedSecret,
      ephemeralPub,
    );

    const iv = CryptoAdapter.randomBytes(12);
    const { cipherText, tag } = CryptoAdapter.encryptAes256Gcm(
      aesKey,
      iv,
      messageBuffer,
    );

    const result = [
      Buffer.from(ephemeralPub).toString('base64'),
      iv.toString('base64'),
      Buffer.from(cipherText).toString('base64'),
      Buffer.from(tag).toString('base64'),
    ].join('.');

    return new EncryptedPayload(result);
  }
}
