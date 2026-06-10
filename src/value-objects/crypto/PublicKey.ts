import { Buffer } from 'buffer';

import { InvalidFormatError } from '../../errors/InvalidFormatError';
import { InvalidLengthError } from '../../errors/InvalidLengthError';
import { assert } from '../../patterns';
import { Media } from '../media';
import { NullObject } from '../NullObject';
import { StringValueObject } from '../StringValueObject';
import { AsymmetricEncryptedPayload } from './AsymmetricEncryptedPayload';
import { CryptoAdapter } from './CryptoAdapter';
import { CryptoPayload } from './CryptoPayload';
import { Key } from './Key';
import { Signature } from './Signature';

export class PublicKey extends Key {
  private static readonly LENGTH = 113;
  private static readonly MAX_PAYLOAD_LENGTH = 1024 * 1024;
  private static readonly PAYLOAD_ALGORITHM = 'x25519-hkdf-sha256-aes-256-gcm';

  private static readonly PAYLOAD_VERSION = 'v2';

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
    const messageBuffer =
      payload instanceof Media
        ? payload.getBuffer()
        : Buffer.from(payload.valueOf());
    const signatureBuffer = Buffer.from(signature.valueOf(), 'base64');
    const valid = CryptoAdapter.verify(
      signatureBuffer,
      messageBuffer,
      this.valueOf(),
    );

    return valid;
  }

  public encrypt(payload: CryptoPayload): AsymmetricEncryptedPayload {
    const messageBuffer =
      payload instanceof Media
        ? payload.getBuffer()
        : Buffer.from(payload.valueOf());

    assert(
      messageBuffer.length <= PublicKey.MAX_PAYLOAD_LENGTH,
      new InvalidLengthError(
        messageBuffer.length,
        PublicKey.MAX_PAYLOAD_LENGTH,
      ),
    );

    const x25519Pub = CryptoAdapter.publicKeyToX25519(this.valueOf());

    const ephemeralPriv = CryptoAdapter.x25519RandomPrivateKey();
    const ephemeralPub = CryptoAdapter.x25519PublicKey(ephemeralPriv);
    const sharedSecret = CryptoAdapter.x25519SharedSecret(
      ephemeralPriv,
      x25519Pub,
    );

    const aesKey = CryptoAdapter.deriveEncryptionKeyWithHkdf(
      sharedSecret,
      ephemeralPub,
      x25519Pub,
    );

    const iv = CryptoAdapter.randomBytes(12);
    const { cipherText, tag } = CryptoAdapter.encryptAes256Gcm(
      aesKey,
      iv,
      messageBuffer,
    );

    const result = [
      PublicKey.PAYLOAD_VERSION,
      PublicKey.PAYLOAD_ALGORITHM,
      Buffer.from(ephemeralPub).toString('base64'),
      iv.toString('base64'),
      Buffer.from(cipherText).toString('base64'),
      Buffer.from(tag).toString('base64'),
    ].join('.');

    return new AsymmetricEncryptedPayload(result);
  }
}
