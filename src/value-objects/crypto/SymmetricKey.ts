import { Buffer } from 'buffer';

import { InvalidFormatError } from '../../errors/InvalidFormatError';
import { InvalidLengthError } from '../../errors/InvalidLengthError';
import { assert } from '../../patterns';
import { Media } from '../media';
import { NullObject } from '../NullObject';
import { StringValueObject } from '../StringValueObject';
import { ValueObject } from '../ValueObject';
import { CryptoAdapter } from './CryptoAdapter';
import { CryptoPayload } from './CryptoPayload';
import { CryptoDerivation } from './encrypted-private-key/CryptoDerivation';
import { EncryptedPayload } from './EncryptedPayload';
import { SymmetricEncryptedPayload } from './SymmetricEncryptedPayload';

export type SymmetricKeyDerivationOptions = {
  N?: number;
  p?: number;
  r?: number;
  salt: string | StringValueObject | Buffer;
};

export class SymmetricKey extends ValueObject<string> {
  private static readonly ALGORITHM = 'aes-256-gcm';
  private static readonly IV_LENGTH = 12;
  private static readonly KEY_LENGTH = 32;
  private static readonly MAX_PAYLOAD_LENGTH = 1024 * 1024;
  private static readonly PAYLOAD_PARTS = 5;
  private static readonly SCRYPT_N = 16384;
  private static readonly SCRYPT_P = 1;
  private static readonly SCRYPT_R = 8;
  private static readonly TAG_LENGTH = 16;
  private static readonly VERSION = 'v1';
  private static readonly BASE64_PATTERN =
    /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;

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
        SymmetricKey.BASE64_PATTERN.test(value),
      new InvalidFormatError(encryptedPayload.valueOf()),
    );
  }

  private static ensureBase64DecodedLength(
    value: string,
    encryptedPayload: EncryptedPayload,
    length: number,
  ): void {
    SymmetricKey.ensureIsBase64(value, encryptedPayload);
    assert(
      SymmetricKey.getBase64DecodedLength(value) === length,
      new InvalidFormatError(encryptedPayload.valueOf()),
    );
  }

  private static getSaltBytes(
    salt: string | StringValueObject | Buffer,
  ): Buffer {
    if (Buffer.isBuffer(salt)) {
      return salt;
    }

    return Buffer.from(salt.valueOf());
  }

  private static getPayloadBytes(payload: CryptoPayload): Buffer {
    return payload instanceof Media
      ? payload.getBuffer()
      : Buffer.from(payload.valueOf());
  }

  public static fromBase64(key: string | StringValueObject): SymmetricKey {
    return new SymmetricKey(key.valueOf());
  }

  public static fromBuffer(key: Buffer): SymmetricKey {
    assert(
      key.length === SymmetricKey.KEY_LENGTH,
      new InvalidLengthError(key.length, SymmetricKey.KEY_LENGTH),
    );

    return new SymmetricKey(key.toString('base64'));
  }

  public static generate(): SymmetricKey {
    return SymmetricKey.fromBuffer(
      CryptoAdapter.randomBytes(SymmetricKey.KEY_LENGTH),
    );
  }

  public static async fromPassword(
    password: string | StringValueObject,
    options: SymmetricKeyDerivationOptions,
  ): Promise<SymmetricKey> {
    const salt = SymmetricKey.getSaltBytes(options.salt);
    assert(salt.length > 0, new InvalidLengthError(salt.length, 1));

    const key = await CryptoDerivation.scryptAsync(
      password.valueOf(),
      salt,
      SymmetricKey.KEY_LENGTH,
      {
        N: options.N ?? SymmetricKey.SCRYPT_N,
        p: options.p ?? SymmetricKey.SCRYPT_P,
        r: options.r ?? SymmetricKey.SCRYPT_R,
      },
    );

    return SymmetricKey.fromBuffer(Buffer.from(key));
  }

  constructor(value: string | StringValueObject) {
    super(value?.valueOf());

    if (NullObject.isNullObject(this)) {
      return this;
    }

    this.ensureIsValidKey(this.value);
  }

  private ensureIsValidKey(value: string): void {
    assert(
      value.length % 4 === 0 && SymmetricKey.BASE64_PATTERN.test(value),
      new InvalidFormatError(value),
    );
    assert(
      SymmetricKey.getBase64DecodedLength(value) === SymmetricKey.KEY_LENGTH,
      new InvalidLengthError(
        SymmetricKey.getBase64DecodedLength(value),
        SymmetricKey.KEY_LENGTH,
      ),
    );
  }

  public getBuffer(): Buffer {
    return Buffer.from(this.valueOf(), 'base64');
  }

  public encrypt(payload: CryptoPayload): SymmetricEncryptedPayload {
    const messageBuffer = SymmetricKey.getPayloadBytes(payload);
    assert(
      messageBuffer.length <= SymmetricKey.MAX_PAYLOAD_LENGTH,
      new InvalidLengthError(
        messageBuffer.length,
        SymmetricKey.MAX_PAYLOAD_LENGTH,
      ),
    );

    const iv = CryptoAdapter.randomBytes(SymmetricKey.IV_LENGTH);
    const { cipherText, tag } = CryptoAdapter.encryptAes256Gcm(
      this.getBuffer(),
      iv,
      messageBuffer,
    );

    const result = [
      SymmetricKey.VERSION,
      SymmetricKey.ALGORITHM,
      iv.toString('base64'),
      Buffer.from(cipherText).toString('base64'),
      Buffer.from(tag).toString('base64'),
    ].join('.');

    return new SymmetricEncryptedPayload(result);
  }

  public decrypt(encryptedPayload: EncryptedPayload): Buffer {
    const parts = encryptedPayload.valueOf().split('.');
    assert(
      parts.length === SymmetricKey.PAYLOAD_PARTS,
      new InvalidFormatError(encryptedPayload.valueOf()),
    );

    const [version, algorithm, ivB64, cipherTextB64, tagB64] = parts;
    assert(
      version === SymmetricKey.VERSION && algorithm === SymmetricKey.ALGORITHM,
      new InvalidFormatError(encryptedPayload.valueOf()),
    );

    SymmetricKey.ensureBase64DecodedLength(
      ivB64,
      encryptedPayload,
      SymmetricKey.IV_LENGTH,
    );
    SymmetricKey.ensureIsBase64(cipherTextB64, encryptedPayload, {
      allowEmpty: true,
    });
    const cipherTextLength = SymmetricKey.getBase64DecodedLength(cipherTextB64);
    assert(
      cipherTextLength <= SymmetricKey.MAX_PAYLOAD_LENGTH,
      new InvalidLengthError(cipherTextLength, SymmetricKey.MAX_PAYLOAD_LENGTH),
    );
    SymmetricKey.ensureBase64DecodedLength(
      tagB64,
      encryptedPayload,
      SymmetricKey.TAG_LENGTH,
    );

    return CryptoAdapter.decryptAes256Gcm(
      this.getBuffer(),
      Buffer.from(ivB64, 'base64'),
      Buffer.from(cipherTextB64, 'base64'),
      Buffer.from(tagB64, 'base64'),
    );
  }
}
