import { PrimitiveOf } from '../../interfaces';
import { StringValueObject } from '../StringValueObject';
import { CryptoPayload } from './CryptoPayload';
import { EncryptedPayload } from './EncryptedPayload';
import { EncryptedPrivateKey } from './EncryptedPrivateKey';
import { PrivateKey } from './PrivateKey';
import { PublicKey } from './PublicKey';
import { Signature } from './Signature';

export class EncryptedKeyPair {
  public static async encryptKeyPair(
    publicKey: PublicKey,
    privateKey: PrivateKey,
    password: string | StringValueObject,
  ): Promise<EncryptedKeyPair> {
    const encryptedPrivateKey = await EncryptedPrivateKey.create(
      privateKey,
      password,
    );

    return new EncryptedKeyPair(publicKey, encryptedPrivateKey);
  }

  public static fromPrimitives(
    primitives: PrimitiveOf<EncryptedKeyPair>,
  ): EncryptedKeyPair {
    return new EncryptedKeyPair(
      new PublicKey(primitives.publicKey),
      new EncryptedPrivateKey(primitives.encryptedPrivateKey),
    );
  }

  constructor(
    private readonly publicKey: PublicKey,
    private readonly encryptedPrivateKey: EncryptedPrivateKey,
  ) {}

  public isValidSignature(
    payload: CryptoPayload,
    signature: Signature,
  ): boolean {
    return this.publicKey.isValidSignature(payload, signature);
  }

  public async sign(
    payload: CryptoPayload,
    password: string | StringValueObject,
  ): Promise<Signature> {
    const privateKey = await this.encryptedPrivateKey.decrypt(password);

    return privateKey.sign(payload);
  }

  public toPrimitives() {
    return {
      encryptedPrivateKey: this.encryptedPrivateKey.valueOf(),
      publicKey: this.publicKey.valueOf(),
    };
  }

  public encrypt(payload: CryptoPayload): EncryptedPayload {
    return this.publicKey.encrypt(payload);
  }

  public async decrypt(
    encryptedPayload: EncryptedPayload,
    password: string | StringValueObject,
  ): Promise<Buffer> {
    const privateKey = await this.encryptedPrivateKey.decrypt(password);

    return privateKey.decrypt(encryptedPayload);
  }
}
