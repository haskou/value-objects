import { gcm } from '@noble/ciphers/aes.js';
import { ed25519, x25519 } from '@noble/curves/ed25519.js';
import { md5 } from '@noble/hashes/legacy.js';
import { sha256, sha512 } from '@noble/hashes/sha2.js';
import {
  bytesToHex,
  concatBytes,
  hexToBytes,
  randomBytes,
} from '@noble/hashes/utils.js';
import { Buffer } from 'buffer';

const privateKeyDerPrefix = hexToBytes('302e020100300506032b657004220420');
const publicKeyDerPrefix = hexToBytes('302a300506032b6570032100');
const gcmTagLength = 16;

type HashAlgorithm = 'md5' | 'sha256' | 'sha512';

export class CryptoAdapter {
  private static pemToDer(pem: string): Buffer {
    const base64 = pem
      .replace(/-----BEGIN (?:PRIVATE|PUBLIC) KEY-----/, '')
      .replace(/-----END (?:PRIVATE|PUBLIC) KEY-----/, '')
      .replace(/\s/g, '');

    return Buffer.from(base64, 'base64');
  }

  private static wrapPem(
    label: 'PRIVATE KEY' | 'PUBLIC KEY',
    der: Uint8Array,
  ): string {
    return `-----BEGIN ${label}-----\n${Buffer.from(der).toString('base64')}\n-----END ${label}-----\n`;
  }

  public static decryptAes256Gcm(
    key: Uint8Array,
    iv: Uint8Array,
    cipherText: Uint8Array,
    tag: Uint8Array,
  ): Buffer {
    return Buffer.from(gcm(key, iv).decrypt(concatBytes(cipherText, tag)));
  }

  public static deriveEncryptionKey(
    sharedSecret: Uint8Array,
    ephemeralPublicKey: Uint8Array,
  ): Uint8Array {
    return sha256(concatBytes(sharedSecret, ephemeralPublicKey));
  }

  public static encryptAes256Gcm(
    key: Uint8Array,
    iv: Uint8Array,
    message: Uint8Array,
  ): { cipherText: Uint8Array; tag: Uint8Array } {
    const encrypted = gcm(key, iv).encrypt(message);

    return {
      cipherText: encrypted.subarray(0, -gcmTagLength),
      tag: encrypted.subarray(-gcmTagLength),
    };
  }

  public static getPublicKey(privateKeyPem: string): string {
    return this.publicKeyToPem(
      ed25519.getPublicKey(this.privateKeyToSeed(privateKeyPem)),
    );
  }

  public static hash(
    algorithm: HashAlgorithm,
    value: string | Uint8Array,
  ): string {
    const bytes = this.toBytes(value);
    const hash = {
      md5,
      sha256,
      sha512,
    }[algorithm];

    return bytesToHex(hash(bytes));
  }

  public static privateKeyToPem(seed: Uint8Array): string {
    return this.wrapPem('PRIVATE KEY', concatBytes(privateKeyDerPrefix, seed));
  }

  public static privateKeyToSeed(privateKeyPem: string): Uint8Array {
    return this.pemToDer(privateKeyPem).subarray(privateKeyDerPrefix.length);
  }

  public static privateKeyToX25519(privateKeyPem: string): Uint8Array {
    return ed25519.utils.toMontgomerySecret(
      this.privateKeyToSeed(privateKeyPem),
    );
  }

  public static publicKeyToPem(publicKey: Uint8Array): string {
    return this.wrapPem(
      'PUBLIC KEY',
      concatBytes(publicKeyDerPrefix, publicKey),
    );
  }

  public static publicKeyToX25519(publicKeyPem: string): Uint8Array {
    return ed25519.utils.toMontgomery(this.publicKeyToBytes(publicKeyPem));
  }

  public static publicKeyToBytes(publicKeyPem: string): Uint8Array {
    return this.pemToDer(publicKeyPem).subarray(publicKeyDerPrefix.length);
  }

  public static randomBytes(size: number): Buffer {
    return Buffer.from(randomBytes(size));
  }

  public static randomPrivateKeyPem(): string {
    return this.privateKeyToPem(ed25519.utils.randomSecretKey());
  }

  public static sign(message: Uint8Array, privateKeyPem: string): Buffer {
    return Buffer.from(
      ed25519.sign(message, this.privateKeyToSeed(privateKeyPem)),
    );
  }

  public static toBytes(value: string | Uint8Array): Uint8Array {
    if (value instanceof Uint8Array) {
      return value;
    }

    return Buffer.from(value);
  }

  public static verify(
    signature: Uint8Array,
    message: Uint8Array,
    publicKeyPem: string,
  ): boolean {
    return ed25519.verify(
      signature,
      message,
      this.publicKeyToBytes(publicKeyPem),
    );
  }

  public static x25519PublicKey(privateKey: Uint8Array): Uint8Array {
    return x25519.getPublicKey(privateKey);
  }

  public static x25519SharedSecret(
    privateKey: Uint8Array,
    publicKey: Uint8Array,
  ): Uint8Array {
    return x25519.getSharedSecret(privateKey, publicKey);
  }

  public static x25519RandomPrivateKey(): Uint8Array {
    return x25519.utils.randomSecretKey();
  }
}
