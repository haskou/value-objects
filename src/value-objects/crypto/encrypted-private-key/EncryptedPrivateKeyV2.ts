import * as crypto from 'node:crypto';

import { StringValueObject } from '../../StringValueObject';
import { PrivateKey } from '../PrivateKey';
import { CryptoDerivation } from './CryptoDerivation';
import { EncryptedPrivateKeyVersion } from './EncryptedPrivateKeyVersion';

export class EncryptedPrivateKeyV2 extends EncryptedPrivateKeyVersion {
  private static readonly VERSION = 'v2';
  private static readonly KDF = 'scrypt';
  private static readonly SCRYPT_N = 16384;
  private static readonly SCRYPT_R = 8;
  private static readonly SCRYPT_P = 1;
  private static readonly SALT_ENTROPY = 16;
  private static readonly IV_ENTROPY = 12;
  private static readonly KEY_LENGTH = 32;
  private static readonly CIPHER = 'aes-256-gcm';
  private static readonly EXPECTED_PARTS = 9;

  private static hasSupportedScryptParameters(parts: string[]): boolean {
    return (
      parts[2] === `N${EncryptedPrivateKeyV2.SCRYPT_N}` &&
      parts[3] === `r${EncryptedPrivateKeyV2.SCRYPT_R}` &&
      parts[4] === `p${EncryptedPrivateKeyV2.SCRYPT_P}`
    );
  }

  public static async encrypt(
    privateKey: PrivateKey,
    password: string | StringValueObject,
  ): Promise<string> {
    const salt = await CryptoDerivation.randomBytesAsync(
      EncryptedPrivateKeyV2.SALT_ENTROPY,
    );
    const key = await CryptoDerivation.scryptAsync(
      password.valueOf(),
      salt,
      EncryptedPrivateKeyV2.KEY_LENGTH,
      {
        N: EncryptedPrivateKeyV2.SCRYPT_N,
        p: EncryptedPrivateKeyV2.SCRYPT_P,
        r: EncryptedPrivateKeyV2.SCRYPT_R,
      },
    );
    const iv = await CryptoDerivation.randomBytesAsync(
      EncryptedPrivateKeyV2.IV_ENTROPY,
    );
    const cipher = crypto.createCipheriv(EncryptedPrivateKeyV2.CIPHER, key, iv);
    const encrypted = Buffer.concat([
      cipher.update(privateKey.valueOf()),
      cipher.final(),
    ]);
    const tag = cipher.getAuthTag();

    return [
      EncryptedPrivateKeyV2.VERSION,
      EncryptedPrivateKeyV2.KDF,
      `N${EncryptedPrivateKeyV2.SCRYPT_N}`,
      `r${EncryptedPrivateKeyV2.SCRYPT_R}`,
      `p${EncryptedPrivateKeyV2.SCRYPT_P}`,
      salt.toString('base64'),
      iv.toString('base64'),
      tag.toString('base64'),
      encrypted.toString('base64'),
    ].join('.');
  }

  public matches(parts: string[]): boolean {
    return (
      parts.length === EncryptedPrivateKeyV2.EXPECTED_PARTS &&
      parts[0] === EncryptedPrivateKeyV2.VERSION &&
      parts[1] === EncryptedPrivateKeyV2.KDF &&
      EncryptedPrivateKeyV2.hasSupportedScryptParameters(parts)
    );
  }

  public async decrypt(
    parts: string[],
    password: string | StringValueObject,
  ): Promise<PrivateKey> {
    if (!EncryptedPrivateKeyV2.hasSupportedScryptParameters(parts)) {
      throw new Error('Unsupported encrypted private key parameters');
    }

    const N = parseInt(parts[2].slice(1), 10);
    const r = parseInt(parts[3].slice(1), 10);
    const p = parseInt(parts[4].slice(1), 10);
    const salt = Buffer.from(parts[5], 'base64');
    const iv = Buffer.from(parts[6], 'base64');
    const tag = Buffer.from(parts[7], 'base64');
    const cipherText = Buffer.from(parts[8], 'base64');

    const key = await CryptoDerivation.scryptAsync(
      password.valueOf(),
      salt,
      EncryptedPrivateKeyV2.KEY_LENGTH,
      { N, p, r },
    );

    const decipher = crypto.createDecipheriv(
      EncryptedPrivateKeyV2.CIPHER,
      key,
      iv,
    );
    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([
      decipher.update(cipherText),
      decipher.final(),
    ]);

    return new PrivateKey(decrypted.toString());
  }
}
