import { Buffer } from 'buffer';

import { InvalidFormatError } from '../../errors/InvalidFormatError';
import { InvalidLengthError } from '../../errors/InvalidLengthError';
import { assert } from '../../patterns';
import { Media } from '../media';
import { NullObject } from '../NullObject';
import { Password } from '../Password';
import { StringValueObject } from '../StringValueObject';
import { ValueObject } from '../ValueObject';
import { CryptoAdapter } from './CryptoAdapter';
import { CryptoPayload } from './CryptoPayload';
import { CryptoDerivation } from './encrypted-private-key/CryptoDerivation';
import { EncryptedPayload } from './EncryptedPayload';
import { StrictBase64 } from './StrictBase64';
import { SymmetricEncryptedPayload } from './SymmetricEncryptedPayload';

export type SymmetricKeyDerivationOptions = {
  N?: number;
  p?: number;
  r?: number;
  salt: string | StringValueObject | Buffer;
};

export type CryptoPassword = string | StringValueObject | Password;

export type SymmetricKeyCryptOptions = {
  aad?: string | StringValueObject | Buffer;
};

export class SymmetricKey extends ValueObject<string> {
  private static readonly ALGORITHM = 'aes-256-gcm';
  private static readonly IV_LENGTH = 12;
  private static readonly KEY_LENGTH = 32;
  private static readonly MAX_PAYLOAD_LENGTH = 8 * 1024 * 1024;
  private static readonly PAYLOAD_PARTS = 5;
  private static readonly SCRYPT_N = 16384;
  private static readonly SCRYPT_P = 1;
  private static readonly SCRYPT_R = 8;
  private static readonly OWASP_SCRYPT_N = 16384;
  private static readonly OWASP_SCRYPT_P = 5;
  private static readonly OWASP_SCRYPT_R = 8;
  private static readonly TAG_LENGTH = 16;
  private static readonly VERSION = 'v1';

  private static ensureIsBase64(
    value: string,
    encryptedPayload: EncryptedPayload,
    options: { allowEmpty: boolean },
  ): void {
    StrictBase64.ensure(
      value,
      new InvalidFormatError(encryptedPayload.valueOf()),
      options,
    );
  }

  private static ensureBase64DecodedLength(
    value: string,
    encryptedPayload: EncryptedPayload,
    length: number,
  ): void {
    StrictBase64.ensureDecodedLength(
      value,
      new InvalidFormatError(encryptedPayload.valueOf()),
      length,
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

  private static getAadBytes(aad: string | StringValueObject | Buffer): Buffer {
    if (Buffer.isBuffer(aad)) {
      return aad;
    }

    return Buffer.from(aad.valueOf());
  }

  private static getDefaultAad(version: string, algorithm: string): Buffer {
    return Buffer.from([version, algorithm].join('.'));
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
    password: CryptoPassword,
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

  public static async fromPasswordUsingOwasp(
    password: CryptoPassword,
    options: Pick<SymmetricKeyDerivationOptions, 'salt'>,
  ): Promise<SymmetricKey> {
    return SymmetricKey.fromPassword(password, {
      N: SymmetricKey.OWASP_SCRYPT_N,
      p: SymmetricKey.OWASP_SCRYPT_P,
      r: SymmetricKey.OWASP_SCRYPT_R,
      salt: options.salt,
    });
  }

  constructor(value: string | StringValueObject) {
    super(value?.valueOf());

    if (NullObject.isNullObject(this)) {
      return this;
    }

    this.ensureIsValidKey(this.value);
  }

  private ensureIsValidKey(value: string): void {
    StrictBase64.ensure(value, new InvalidFormatError(value));
    const decodedLength = StrictBase64.getDecodedLength(value);
    assert(
      decodedLength === SymmetricKey.KEY_LENGTH,
      new InvalidLengthError(decodedLength, SymmetricKey.KEY_LENGTH),
    );
  }

  public getBuffer(): Buffer {
    return Buffer.from(this.valueOf(), 'base64');
  }

  public encrypt(
    payload: CryptoPayload,
    options: SymmetricKeyCryptOptions = {},
  ): SymmetricEncryptedPayload {
    const messageBuffer = SymmetricKey.getPayloadBytes(payload);
    assert(
      messageBuffer.length <= SymmetricKey.MAX_PAYLOAD_LENGTH,
      new InvalidLengthError(
        messageBuffer.length,
        SymmetricKey.MAX_PAYLOAD_LENGTH,
      ),
    );

    const iv = CryptoAdapter.randomBytes(SymmetricKey.IV_LENGTH);
    const aad =
      options.aad === undefined
        ? SymmetricKey.getDefaultAad(
            SymmetricKey.VERSION,
            SymmetricKey.ALGORITHM,
          )
        : SymmetricKey.getAadBytes(options.aad);
    const { cipherText, tag } = CryptoAdapter.encryptAes256Gcm(
      this.getBuffer(),
      iv,
      messageBuffer,
      aad,
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

  public decrypt(
    encryptedPayload: EncryptedPayload,
    options: SymmetricKeyCryptOptions = {},
  ): Buffer {
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
    const cipherTextLength = StrictBase64.getDecodedLength(cipherTextB64);
    assert(
      cipherTextLength <= SymmetricKey.MAX_PAYLOAD_LENGTH,
      new InvalidLengthError(cipherTextLength, SymmetricKey.MAX_PAYLOAD_LENGTH),
    );
    SymmetricKey.ensureIsBase64(cipherTextB64, encryptedPayload, {
      allowEmpty: true,
    });
    SymmetricKey.ensureBase64DecodedLength(
      tagB64,
      encryptedPayload,
      SymmetricKey.TAG_LENGTH,
    );

    const key = this.getBuffer();
    const formatError = new InvalidFormatError(encryptedPayload.valueOf());
    const iv = StrictBase64.decode(ivB64, formatError);
    const cipherText = StrictBase64.decode(cipherTextB64, formatError, {
      allowEmpty: true,
    });
    const tag = StrictBase64.decode(tagB64, formatError);
    const aad =
      options.aad === undefined
        ? SymmetricKey.getDefaultAad(version, algorithm)
        : SymmetricKey.getAadBytes(options.aad);

    try {
      return CryptoAdapter.decryptAes256Gcm(key, iv, cipherText, tag, aad);
    } catch (error) {
      if (options.aad !== undefined) {
        throw error;
      }

      return CryptoAdapter.decryptAes256Gcm(key, iv, cipherText, tag);
    }
  }
}
