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
  private static readonly ENCRYPTED_PAYLOAD_PARTS = 4;
  private static readonly EPHEMERAL_PUBLIC_KEY_LENGTH = 32;
  private static readonly IV_LENGTH = 12;
  private static readonly TAG_LENGTH = 16;
  private static readonly MAX_CIPHERTEXT_LENGTH = 1024 * 1024;
  private static readonly BASE64_PATTERN =
    /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;

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
    const decodeBase64 = (value: string): Buffer => {
      assert(
        value.length > 0 &&
          value.length % 4 === 0 &&
          PrivateKey.BASE64_PATTERN.test(value),
        new InvalidFormatError(encryptedPayload.valueOf()),
      );

      return Buffer.from(value, 'base64');
    };

    const parts = encryptedPayload.valueOf().split('.');
    assert(
      parts.length === PrivateKey.ENCRYPTED_PAYLOAD_PARTS,
      new InvalidFormatError(encryptedPayload.valueOf()),
    );

    const [ephPubB64, ivB64, cipherTextB64, tagB64] = parts;
    const ephemeralPub = decodeBase64(ephPubB64);
    const iv = decodeBase64(ivB64);
    const cipherText = decodeBase64(cipherTextB64);
    const tag = decodeBase64(tagB64);

    assert(
      ephemeralPub.length === PrivateKey.EPHEMERAL_PUBLIC_KEY_LENGTH,
      new InvalidFormatError(encryptedPayload.valueOf()),
    );
    assert(
      iv.length === PrivateKey.IV_LENGTH,
      new InvalidFormatError(encryptedPayload.valueOf()),
    );
    assert(
      tag.length === PrivateKey.TAG_LENGTH,
      new InvalidFormatError(encryptedPayload.valueOf()),
    );
    assert(
      cipherText.length <= PrivateKey.MAX_CIPHERTEXT_LENGTH,
      new InvalidLengthError(
        cipherText.length,
        PrivateKey.MAX_CIPHERTEXT_LENGTH,
      ),
    );

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
