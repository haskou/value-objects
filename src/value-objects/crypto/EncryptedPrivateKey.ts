import * as crypto from 'node:crypto';

import { StringValueObject } from '../StringValueObject';
import { ValueObject } from '../ValueObject';
import { PrivateKey } from './PrivateKey';

export class EncryptedPrivateKey extends ValueObject<string> {
  private static readonly ITERATIONS = 100000;
  private static readonly SALT_ENTROPY = 16;
  private static readonly IV_ENTROPY = 12;
  private static readonly LENGTH = 32;
  private static readonly ALGORITHM = 'sha256';

  public static async create(
    privateKey: PrivateKey,
    password: string | StringValueObject,
  ): Promise<EncryptedPrivateKey> {
    const salt = crypto.randomBytes(EncryptedPrivateKey.SALT_ENTROPY);

    const encryptedPrivateKey = await new Promise<string>((resolve) => {
      const key = crypto.pbkdf2Sync(
        password.valueOf(),
        salt,
        EncryptedPrivateKey.ITERATIONS,
        EncryptedPrivateKey.LENGTH,
        EncryptedPrivateKey.ALGORITHM,
      );
      const iv = crypto.randomBytes(EncryptedPrivateKey.IV_ENTROPY);
      const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
      const encrypted = Buffer.concat([
        cipher.update(privateKey.valueOf()),
        cipher.final(),
      ]);
      const tag = cipher.getAuthTag();

      resolve(
        [
          encrypted.toString('base64'),
          iv.toString('base64'),
          salt.toString('base64'),
          tag.toString('base64'),
        ].join('.'),
      );
    });

    return new EncryptedPrivateKey(encryptedPrivateKey);
  }

  constructor(encryptedPrivateKey: string | StringValueObject) {
    super(encryptedPrivateKey?.valueOf());
  }

  public decrypt(password: string | StringValueObject): PrivateKey {
    const [cipherTextB64, ivB64, saltB64, tagB64] = this.valueOf().split('.');
    const cipherText = Buffer.from(cipherTextB64, 'base64');
    const iv = Buffer.from(ivB64, 'base64');
    const salt = Buffer.from(saltB64, 'base64');
    const tag = Buffer.from(tagB64, 'base64');

    const key = crypto.pbkdf2Sync(
      password.valueOf(),
      salt,
      EncryptedPrivateKey.ITERATIONS,
      EncryptedPrivateKey.LENGTH,
      EncryptedPrivateKey.ALGORITHM,
    );

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);

    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([
      decipher.update(cipherText),
      decipher.final(),
    ]);

    return new PrivateKey(decrypted.toString());
  }
}
