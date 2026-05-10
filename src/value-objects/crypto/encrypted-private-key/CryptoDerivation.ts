import { pbkdf2Async } from '@noble/hashes/pbkdf2.js';
import { scryptAsync } from '@noble/hashes/scrypt.js';
import { sha256, sha512 } from '@noble/hashes/sha2.js';
import { Buffer } from 'buffer';

import { BrowserCrypto } from '../BrowserCrypto';

type NodeLikeCrypto = {
  pbkdf2?: (
    password: string,
    salt: Buffer,
    iterations: number,
    keyLength: number,
    algorithm: string,
    callback: (err: Error | null, key: Buffer) => void,
  ) => void;
  randomBytes?: (
    size: number,
    callback: (err: Error | null, bytes: Buffer) => void,
  ) => void;
  scrypt?: (
    password: string,
    salt: Buffer,
    keylen: number,
    options: { N: number; r: number; p: number },
    callback: (err: Error | null, key: Buffer) => void,
  ) => void;
};

export class CryptoDerivation {
  public static async pbkdf2Async(
    password: string,
    salt: Buffer,
    iterations: number,
    keyLength: number,
    algorithm: string,
    cryptoModule?: NodeLikeCrypto,
  ): Promise<Buffer> {
    if (cryptoModule?.pbkdf2) {
      return new Promise<Buffer>((resolve, reject) => {
        cryptoModule.pbkdf2!(
          password,
          salt,
          iterations,
          keyLength,
          algorithm,
          (err, key) => {
            if (err) reject(err);
            else resolve(key);
          },
        );
      });
    }

    const hash = algorithm === 'sha512' ? sha512 : sha256;
    const key = await pbkdf2Async(hash, password, salt, {
      c: iterations,
      dkLen: keyLength,
    });

    return Buffer.from(key);
  }

  public static scryptAsync(
    password: string,
    salt: Buffer,
    keylen: number,
    options: { N: number; r: number; p: number },
    cryptoModule?: NodeLikeCrypto,
  ): Promise<Buffer> {
    if (cryptoModule?.scrypt) {
      return new Promise<Buffer>((resolve, reject) => {
        cryptoModule.scrypt!(password, salt, keylen, options, (err, key) => {
          if (err) reject(err);
          else resolve(key);
        });
      });
    }

    return scryptAsync(password, salt, { ...options, dkLen: keylen }).then(
      Buffer.from,
    );
  }

  public static async randomBytesAsync(
    size: number,
    cryptoModule?: NodeLikeCrypto,
  ): Promise<Buffer> {
    if (cryptoModule?.randomBytes) {
      return new Promise<Buffer>((resolve, reject) => {
        cryptoModule.randomBytes!(size, (err, bytes) => {
          if (err) reject(err);
          else resolve(bytes);
        });
      });
    }

    return BrowserCrypto.randomBytes(size);
  }
}
