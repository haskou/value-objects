import * as crypto from 'node:crypto';

import { PrimitiveOf } from '../../interfaces';
import { StringValueObject } from '../StringValueObject';
import { CryptoPayload } from './CryptoPayload';
import { EncryptedKeyPair } from './EncryptedKeyPair';
import { PrivateKey } from './PrivateKey';
import { PublicKey } from './PublicKey';
import { Signature } from './Signature';

export class KeyPair {
  public static generate(): KeyPair {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('ed25519', {
      privateKeyEncoding: { format: 'pem', type: 'pkcs8' },
      publicKeyEncoding: { format: 'pem', type: 'spki' },
    });

    return new KeyPair(new PublicKey(publicKey), new PrivateKey(privateKey));
  }

  public static fromPrimitives(primitives: PrimitiveOf<KeyPair>): KeyPair {
    return new KeyPair(
      new PublicKey(primitives.publicKey),
      new PrivateKey(primitives.privateKey),
    );
  }

  constructor(
    private readonly publicKey: PublicKey,
    private readonly privateKey: PrivateKey,
  ) {}

  public async encryptKeyPair(
    password: string | StringValueObject,
  ): Promise<EncryptedKeyPair> {
    return await EncryptedKeyPair.encryptKeyPair(
      this.publicKey,
      this.privateKey,
      password.valueOf(),
    );
  }

  public isValidSignature(
    payload: CryptoPayload,
    signature: Signature,
  ): boolean {
    return this.publicKey.isValidSignature(payload, signature);
  }

  public sign(payload: CryptoPayload): Signature {
    return this.privateKey.sign(payload);
  }

  public toPrimitives() {
    return {
      privateKey: this.privateKey.valueOf(),
      publicKey: this.publicKey.valueOf(),
    };
  }
}
