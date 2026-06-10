import { Buffer } from 'buffer';

import { PrivateKey } from '../PrivateKey';
import { SymmetricEncryptedPayload } from '../SymmetricEncryptedPayload';
import { CryptoPassword, SymmetricKey } from '../SymmetricKey';
import { CryptoDerivation } from './CryptoDerivation';
import { EncryptedPrivateKeyVersion } from './EncryptedPrivateKeyVersion';

export class EncryptedPrivateKeyV3 extends EncryptedPrivateKeyVersion {
  private static readonly VERSION = 'v3';
  private static readonly KDF = 'scrypt';
  private static readonly SCRYPT_N = 16384;
  private static readonly SCRYPT_R = 8;
  private static readonly SCRYPT_P = 5;
  private static readonly SALT_ENTROPY = 16;
  private static readonly CIPHER = 'aes-256-gcm';
  private static readonly EXPECTED_PARTS = 9;
  private static readonly SYMMETRIC_PAYLOAD_VERSION = 'v1';

  private static hasSupportedScryptParameters(parts: string[]): boolean {
    return (
      parts[2] === `N${EncryptedPrivateKeyV3.SCRYPT_N}` &&
      parts[3] === `r${EncryptedPrivateKeyV3.SCRYPT_R}` &&
      parts[4] === `p${EncryptedPrivateKeyV3.SCRYPT_P}`
    );
  }

  private static getHeaderParts(): string[] {
    return [
      EncryptedPrivateKeyV3.VERSION,
      EncryptedPrivateKeyV3.KDF,
      `N${EncryptedPrivateKeyV3.SCRYPT_N}`,
      `r${EncryptedPrivateKeyV3.SCRYPT_R}`,
      `p${EncryptedPrivateKeyV3.SCRYPT_P}`,
    ];
  }

  private static getAad(parts: string[]): string {
    return parts.slice(0, 5).join('.');
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
        EncryptedPrivateKeyV3.SYMMETRIC_PAYLOAD_VERSION,
        EncryptedPrivateKeyV3.CIPHER,
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
      EncryptedPrivateKeyV3.SALT_ENTROPY,
    );
    const key = await EncryptedPrivateKeyV3.deriveSymmetricKey(password, salt, {
      N: EncryptedPrivateKeyV3.SCRYPT_N,
      p: EncryptedPrivateKeyV3.SCRYPT_P,
      r: EncryptedPrivateKeyV3.SCRYPT_R,
    });
    const symmetricPayload = key
      .encrypt(privateKey.valueOf(), {
        aad: EncryptedPrivateKeyV3.getHeaderParts().join('.'),
      })
      .valueOf()
      .split('.');
    const iv = symmetricPayload[2];
    const cipherText = symmetricPayload[3];
    const tag = symmetricPayload[4];

    return [
      ...EncryptedPrivateKeyV3.getHeaderParts(),
      salt.toString('base64'),
      iv,
      tag,
      cipherText,
    ].join('.');
  }

  public matches(parts: string[]): boolean {
    return (
      parts.length === EncryptedPrivateKeyV3.EXPECTED_PARTS &&
      parts[0] === EncryptedPrivateKeyV3.VERSION &&
      parts[1] === EncryptedPrivateKeyV3.KDF &&
      EncryptedPrivateKeyV3.hasSupportedScryptParameters(parts)
    );
  }

  public async decrypt(
    parts: string[],
    password: CryptoPassword,
  ): Promise<PrivateKey> {
    if (!EncryptedPrivateKeyV3.hasSupportedScryptParameters(parts)) {
      throw new Error('Unsupported encrypted private key parameters');
    }

    const N = parseInt(parts[2].slice(1), 10);
    const r = parseInt(parts[3].slice(1), 10);
    const p = parseInt(parts[4].slice(1), 10);
    const salt = Buffer.from(parts[5], 'base64');
    const key = await EncryptedPrivateKeyV3.deriveSymmetricKey(password, salt, {
      N,
      p,
      r,
    });

    const decrypted = key.decrypt(
      EncryptedPrivateKeyV3.toSymmetricPayload(parts),
      {
        aad: EncryptedPrivateKeyV3.getAad(parts),
      },
    );

    return new PrivateKey(decrypted.toString());
  }
}
