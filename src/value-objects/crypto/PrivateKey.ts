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

  private static getBase64DecodedLength(value: string): number {
    const padding = value.endsWith('==') ? 2 : value.endsWith('=') ? 1 : 0;

    return (value.length / 4) * 3 - padding;
  }

  private static ensureIsBase64(
    value: string,
    encryptedPayload: EncryptedPayload,
    options: { allowEmpty: boolean } = { allowEmpty: false },
  ): void {
    assert(
      (options.allowEmpty || value.length > 0) &&
        value.length % 4 === 0 &&
        PrivateKey.BASE64_PATTERN.test(value),
      new InvalidFormatError(encryptedPayload.valueOf()),
    );
  }

  private static ensureBase64DecodedLength(
    value: string,
    encryptedPayload: EncryptedPayload,
    length: number,
  ): void {
    PrivateKey.ensureIsBase64(value, encryptedPayload);
    assert(
      PrivateKey.getBase64DecodedLength(value) === length,
      new InvalidFormatError(encryptedPayload.valueOf()),
    );
  }

  private static decodeBase64(
    value: string,
    encryptedPayload: EncryptedPayload,
  ): Buffer {
    PrivateKey.ensureIsBase64(value, encryptedPayload);

    return Buffer.from(value, 'base64');
  }

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
    const parts = encryptedPayload.valueOf().split('.');
    assert(
      parts.length === PrivateKey.ENCRYPTED_PAYLOAD_PARTS,
      new InvalidFormatError(encryptedPayload.valueOf()),
    );

    const [ephPubB64, ivB64, cipherTextB64, tagB64] = parts;
    PrivateKey.ensureIsBase64(cipherTextB64, encryptedPayload, {
      allowEmpty: true,
    });
    const cipherTextLength = PrivateKey.getBase64DecodedLength(cipherTextB64);
    assert(
      cipherTextLength <= PrivateKey.MAX_CIPHERTEXT_LENGTH,
      new InvalidLengthError(
        cipherTextLength,
        PrivateKey.MAX_CIPHERTEXT_LENGTH,
      ),
    );

    PrivateKey.ensureBase64DecodedLength(
      ephPubB64,
      encryptedPayload,
      PrivateKey.EPHEMERAL_PUBLIC_KEY_LENGTH,
    );
    PrivateKey.ensureBase64DecodedLength(
      ivB64,
      encryptedPayload,
      PrivateKey.IV_LENGTH,
    );
    PrivateKey.ensureBase64DecodedLength(
      tagB64,
      encryptedPayload,
      PrivateKey.TAG_LENGTH,
    );

    const ephemeralPub = PrivateKey.decodeBase64(ephPubB64, encryptedPayload);
    const iv = PrivateKey.decodeBase64(ivB64, encryptedPayload);
    const cipherText = Buffer.from(cipherTextB64, 'base64');
    const tag = PrivateKey.decodeBase64(tagB64, encryptedPayload);
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
