import { ed25519, x25519 } from '@noble/curves/ed25519.js';
import { generateKeyPairSync } from 'crypto';
import * as crypto from 'node:crypto';

import { InvalidFormatError } from '../../errors/InvalidFormatError';
import { InvalidLengthError } from '../../errors/InvalidLengthError';
import { assert } from '../../patterns';
import { NullObject } from '../NullObject';
import { StringValueObject } from '../StringValueObject';
import { CryptoPayload } from './CryptoPayload';
import { EncryptedPayload } from './EncryptedPayload';
import { Key } from './Key';
import { Signature } from './Signature';

export class PrivateKey extends Key {
  private static readonly LENGTH = 119;
  private static readonly PATTERN =
    /^-----BEGIN PRIVATE KEY-----\n[A-Za-z0-9+/=]+\n-----END PRIVATE KEY-----\n$/;

  public static fromPEM(pem: string | StringValueObject): PrivateKey {
    return new PrivateKey(pem.valueOf());
  }

  public static generate(): PrivateKey {
    const { privateKey } = generateKeyPairSync('ed25519');
    const pemPrivateKey = privateKey.export({
      format: 'pem',
      type: 'pkcs8',
    });

    return new PrivateKey(pemPrivateKey.toString());
  }

  constructor(value: string | StringValueObject) {
    super(value?.valueOf());

    if (NullObject.isNullObject(this)) {
      return this;
    }

    this.ensureIsValidPrivateKey(this.value);
  }

  private ensureIsValidPrivateKey(value: string): void {
    assert(
      value.length === PrivateKey.LENGTH,
      new InvalidLengthError(value, PrivateKey.LENGTH),
    );
    assert(PrivateKey.PATTERN.test(value), new InvalidFormatError(value));
  }

  public sign(payload: CryptoPayload): Signature {
    const messageBuffer = Buffer.from(payload.valueOf());
    const signatureBuffer = crypto.sign(null, messageBuffer, this.valueOf());

    return Signature.fromBuffer(signatureBuffer);
  }

  public decrypt(encryptedPayload: EncryptedPayload): Buffer {
    const [ephPubB64, ivB64, cipherTextB64, tagB64] = encryptedPayload
      .valueOf()
      .split('.');

    const ephemeralPub = Buffer.from(ephPubB64, 'base64');
    const iv = Buffer.from(ivB64, 'base64');
    const cipherText = Buffer.from(cipherTextB64, 'base64');
    const tag = Buffer.from(tagB64, 'base64');

    const pkcs8Der = crypto
      .createPrivateKey(this.valueOf())
      .export({ format: 'der', type: 'pkcs8' });
    const x25519Priv = ed25519.utils.toMontgomerySecret(pkcs8Der.subarray(16));

    const sharedSecret = x25519.getSharedSecret(x25519Priv, ephemeralPub);

    const aesKey = crypto
      .createHash('sha256')
      .update(sharedSecret)
      .update(ephemeralPub)
      .digest();

    const decipher = crypto.createDecipheriv('aes-256-gcm', aesKey, iv);
    decipher.setAuthTag(tag);

    return Buffer.concat([decipher.update(cipherText), decipher.final()]);
  }
}
