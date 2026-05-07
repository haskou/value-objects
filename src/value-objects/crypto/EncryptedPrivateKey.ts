import * as crypto from 'node:crypto';
import { promisify } from 'node:util';

import { StringValueObject } from '../StringValueObject';
import { ValueObject } from '../ValueObject';
import { PrivateKey } from './PrivateKey';

const pbkdf2 = promisify(crypto.pbkdf2);
const randomBytes = promisify(crypto.randomBytes);

export class EncryptedPrivateKey extends ValueObject<string> {
  private static readonly LEGACY_ITERATIONS = 100000;
  private static readonly LEGACY_ALGORITHM = 'sha256';
  private static readonly ITERATIONS = 600000;

  private static readonly ALGORITHM = 'sha256';
  private static readonly SALT_ENTROPY = 16;
  private static readonly IV_ENTROPY = 12;
  private static readonly KEY_LENGTH = 32;
  private static readonly VERSION = 'v1';
  private static readonly KDF = 'pbkdf2-sha256';

  public static async create(
    privateKey: PrivateKey,
    password: string | StringValueObject,
  ): Promise<EncryptedPrivateKey> {
    const salt = await randomBytes(EncryptedPrivateKey.SALT_ENTROPY);
    const key = await pbkdf2(
      password.valueOf(),
      salt,
      EncryptedPrivateKey.ITERATIONS,
      EncryptedPrivateKey.KEY_LENGTH,
      EncryptedPrivateKey.ALGORITHM,
    );
    const iv = await randomBytes(EncryptedPrivateKey.IV_ENTROPY);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    const encrypted = Buffer.concat([
      cipher.update(privateKey.valueOf()),
      cipher.final(),
    ]);
    const tag = cipher.getAuthTag();

    const encryptedPrivateKey = [
      EncryptedPrivateKey.VERSION,
      EncryptedPrivateKey.KDF,
      EncryptedPrivateKey.ITERATIONS.toString(),
      salt.toString('base64'),
      iv.toString('base64'),
      encrypted.toString('base64'),
      tag.toString('base64'),
    ].join('.');

    return new EncryptedPrivateKey(encryptedPrivateKey);
  }

  constructor(encryptedPrivateKey: string | StringValueObject) {
    super(encryptedPrivateKey?.valueOf());
  }

  public async decrypt(
    password: string | StringValueObject,
  ): Promise<PrivateKey> {
    const parts = this.valueOf().split('.');
    let cipherText: Buffer;
    let iv: Buffer;
    let salt: Buffer;
    let tag: Buffer;
    let key: Buffer;

    if (parts.length === 4) {
      // Legacy format: ciphertext.iv.salt.tag
      [cipherText, iv, salt, tag] = parts.map((part) =>
        Buffer.from(part, 'base64'),
      );
      key = await pbkdf2(
        password.valueOf(),
        salt,
        EncryptedPrivateKey.LEGACY_ITERATIONS,
        EncryptedPrivateKey.KEY_LENGTH,
        EncryptedPrivateKey.ALGORITHM,
      );
    } else if (
      parts.length === 7 &&
      parts[0] === EncryptedPrivateKey.VERSION &&
      parts[1] === EncryptedPrivateKey.KDF
    ) {
      // New format: v1.pbkdf2-sha256.iterations.salt.iv.ciphertext.tag
      const iterations = parseInt(parts[2], 10);
      salt = Buffer.from(parts[3], 'base64');
      iv = Buffer.from(parts[4], 'base64');
      cipherText = Buffer.from(parts[5], 'base64');
      tag = Buffer.from(parts[6], 'base64');
      key = await pbkdf2(
        password.valueOf(),
        salt,
        iterations,
        EncryptedPrivateKey.KEY_LENGTH,
        EncryptedPrivateKey.ALGORITHM,
      );
    } else {
      throw new Error('Invalid encrypted private key format');
    }

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([
      decipher.update(cipherText),
      decipher.final(),
    ]);

    return new PrivateKey(decrypted.toString());
  }
}
