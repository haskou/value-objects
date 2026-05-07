import * as crypto from 'node:crypto';
import { promisify } from 'node:util';

export class CryptoDerivation {
  private static readonly pbkdf2Fn = promisify(crypto.pbkdf2);
  private static readonly randomBytesFn = promisify(crypto.randomBytes);

  public static pbkdf2Async(
    password: string,
    salt: Buffer,
    iterations: number,
    keyLength: number,
    algorithm: string,
    cryptoModule: typeof crypto = crypto,
  ): Promise<Buffer> {
    if (cryptoModule === crypto) {
      return this.pbkdf2Fn(
        password,
        salt,
        iterations,
        keyLength,
        algorithm,
      ) as Promise<Buffer>;
    }

    return promisify(cryptoModule.pbkdf2)(
      password,
      salt,
      iterations,
      keyLength,
      algorithm,
    ) as Promise<Buffer>;
  }

  public static scryptAsync(
    password: string,
    salt: Buffer,
    keylen: number,
    options: { N: number; r: number; p: number },
    cryptoModule: typeof crypto = crypto,
  ): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      cryptoModule.scrypt(password, salt, keylen, options, (err, key) => {
        if (err) reject(err);
        else resolve(key);
      });
    });
  }

  public static randomBytesAsync(
    size: number,
    cryptoModule: typeof crypto = crypto,
  ): Promise<Buffer> {
    if (cryptoModule === crypto) {
      return this.randomBytesFn(size) as Promise<Buffer>;
    }

    return promisify(cryptoModule.randomBytes)(size) as Promise<Buffer>;
  }
}
