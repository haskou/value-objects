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
import { PublicKey } from './PublicKey';
import { Signature } from './Signature';

export class PrivateKey extends Key {
  private static readonly LENGTH = 119;
  private static readonly PATTERN =
    /^-----BEGIN PRIVATE KEY-----\n[A-Za-z0-9+/=]+\n-----END PRIVATE KEY-----\n$/;

  public static fromPEM(pem: string | StringValueObject): PrivateKey {
    return new PrivateKey(pem.valueOf());
  }

  public static generate(): PrivateKey {
    return new PrivateKey(CryptoAdapter.randomPrivateKeyPem());
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

  public getPublicKey(): PublicKey {
    return PublicKey.fromPEM(CryptoAdapter.getPublicKey(this.valueOf()));
  }

  public sign(payload: CryptoPayload): Signature {
    const messageBuffer = Buffer.from(payload.valueOf());
    const signatureBuffer = CryptoAdapter.sign(messageBuffer, this.valueOf());

    return Signature.fromBuffer(signatureBuffer);
  }

  public decrypt(encryptedPayload: EncryptedPayload): Buffer {
    const [ephPubB64, ivB64, cipherTextB64, tagB64] = encryptedPayload
      .valueOf()
      .split('.');

    const ephemeralPub = Buffer.from(ephPubB64, 'base64');
    const iv = Buffer.from(ivB64, 'base64');
    const cipherText = Buffer.from(cipherTextB64, 'base64');
    const tag = Buffer.from(tagB64, 'base64');

    const x25519Priv = CryptoAdapter.privateKeyToX25519(this.valueOf());

    const sharedSecret = CryptoAdapter.x25519SharedSecret(
      x25519Priv,
      ephemeralPub,
    );

    const aesKey = CryptoAdapter.deriveEncryptionKey(
      sharedSecret,
      ephemeralPub,
    );

    return CryptoAdapter.decryptAes256Gcm(aesKey, iv, cipherText, tag);
  }
}
