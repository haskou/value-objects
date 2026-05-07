import * as crypto from 'node:crypto';

import { StringValueObject } from '../../StringValueObject';
import { PrivateKey } from '../PrivateKey';
import { CryptoDerivation } from './CryptoDerivation';
import { EncryptedPrivateKeyVersion } from './EncryptedPrivateKeyVersion';

export class EncryptedPrivateKeyLegacy extends EncryptedPrivateKeyVersion {
  private static readonly LEGACY_ITERATIONS = 100000;
  private static readonly LEGACY_ALGORITHM = 'sha256';
  private static readonly KEY_LENGTH = 32;
  private static readonly CIPHER = 'aes-256-gcm';
  private static readonly EXPECTED_PARTS = 4;

  public matches(parts: string[]): boolean {
    return parts.length === EncryptedPrivateKeyLegacy.EXPECTED_PARTS;
  }

  public async decrypt(
    parts: string[],
    password: string | StringValueObject,
  ): Promise<PrivateKey> {
    const [cipherTextB64, ivB64, saltB64, tagB64] = parts;
    const cipherText = Buffer.from(cipherTextB64, 'base64');
    const iv = Buffer.from(ivB64, 'base64');
    const salt = Buffer.from(saltB64, 'base64');
    const tag = Buffer.from(tagB64, 'base64');

    const key = await CryptoDerivation.pbkdf2Async(
      password.valueOf(),
      salt,
      EncryptedPrivateKeyLegacy.LEGACY_ITERATIONS,
      EncryptedPrivateKeyLegacy.KEY_LENGTH,
      EncryptedPrivateKeyLegacy.LEGACY_ALGORITHM,
    );

    const decipher = crypto.createDecipheriv(
      EncryptedPrivateKeyLegacy.CIPHER,
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

  public needsReEncryption(): boolean {
    return true;
  }
}
