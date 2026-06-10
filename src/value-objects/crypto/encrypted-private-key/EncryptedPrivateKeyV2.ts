import { Buffer } from 'buffer';

import { InvalidEncryptedPrivateKeyFormatError } from '../../../errors/InvalidEncryptedPrivateKeyFormatError';
import { PrivateKey } from '../PrivateKey';
import { SymmetricEncryptedPayload } from '../SymmetricEncryptedPayload';
import { CryptoPassword, SymmetricKey } from '../SymmetricKey';
import { CryptoDerivation } from './CryptoDerivation';
import { EncryptedPrivateKeyVersion } from './EncryptedPrivateKeyVersion';

export class EncryptedPrivateKeyV2 extends EncryptedPrivateKeyVersion {
  private static readonly VERSION = 'v2';
  private static readonly KDF = 'scrypt';
  private static readonly SCRYPT_N = 16384;
  private static readonly SCRYPT_R = 8;
  private static readonly SCRYPT_P = 1;
  private static readonly SALT_ENTROPY = 16;
  private static readonly CIPHER = 'aes-256-gcm';
  private static readonly EXPECTED_PARTS = 9;
  private static readonly SYMMETRIC_PAYLOAD_VERSION = 'v1';

  private static hasSupportedScryptParameters(parts: string[]): boolean {
    return (
      parts[2] === `N${EncryptedPrivateKeyV2.SCRYPT_N}` &&
      parts[3] === `r${EncryptedPrivateKeyV2.SCRYPT_R}` &&
      parts[4] === `p${EncryptedPrivateKeyV2.SCRYPT_P}`
    );
  }

  private static async deriveSymmetricKey(
    password: CryptoPassword,
    salt: Buffer,
    options: { N: number; p: number; r: number },
  ): Promise<SymmetricKey> {
    return SymmetricKey.fromPassword(password, { ...options, salt });
  }

  private static toSymmetricPayload(
    parts: string[],
  ): SymmetricEncryptedPayload {
    const iv = parts[6];
    const tag = parts[7];
    const cipherText = parts[8];

    return new SymmetricEncryptedPayload(
      [
        EncryptedPrivateKeyV2.SYMMETRIC_PAYLOAD_VERSION,
        EncryptedPrivateKeyV2.CIPHER,
        iv,
        cipherText,
        tag,
      ].join('.'),
    );
  }

  public static async encrypt(
    privateKey: PrivateKey,
    password: CryptoPassword,
  ): Promise<string> {
    const salt = await CryptoDerivation.randomBytesAsync(
      EncryptedPrivateKeyV2.SALT_ENTROPY,
    );
    const key = await EncryptedPrivateKeyV2.deriveSymmetricKey(password, salt, {
      N: EncryptedPrivateKeyV2.SCRYPT_N,
      p: EncryptedPrivateKeyV2.SCRYPT_P,
      r: EncryptedPrivateKeyV2.SCRYPT_R,
    });
    const symmetricPayload = key
      .encrypt(privateKey.valueOf())
      .valueOf()
      .split('.');
    const iv = symmetricPayload[2];
    const cipherText = symmetricPayload[3];
    const tag = symmetricPayload[4];

    return [
      EncryptedPrivateKeyV2.VERSION,
      EncryptedPrivateKeyV2.KDF,
      `N${EncryptedPrivateKeyV2.SCRYPT_N}`,
      `r${EncryptedPrivateKeyV2.SCRYPT_R}`,
      `p${EncryptedPrivateKeyV2.SCRYPT_P}`,
      salt.toString('base64'),
      iv,
      tag,
      cipherText,
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
    password: CryptoPassword,
  ): Promise<PrivateKey> {
    if (!EncryptedPrivateKeyV2.hasSupportedScryptParameters(parts)) {
      throw new InvalidEncryptedPrivateKeyFormatError(
        'Unsupported encrypted private key parameters',
      );
    }

    const N = parseInt(parts[2].slice(1), 10);
    const r = parseInt(parts[3].slice(1), 10);
    const p = parseInt(parts[4].slice(1), 10);
    const salt = Buffer.from(parts[5], 'base64');
    const key = await EncryptedPrivateKeyV2.deriveSymmetricKey(password, salt, {
      N,
      p,
      r,
    });

    const decrypted = key.decrypt(
      EncryptedPrivateKeyV2.toSymmetricPayload(parts),
    );

    return new PrivateKey(decrypted.toString());
  }

  public needsReEncryption(): boolean {
    return true;
  }
}
