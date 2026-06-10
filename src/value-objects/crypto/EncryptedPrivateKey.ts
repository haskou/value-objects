import { InvalidEncryptedPrivateKeyFormatError } from '../../errors/InvalidEncryptedPrivateKeyFormatError';
import { assert } from '../../patterns';
import { StringValueObject } from '../StringValueObject';
import { ValueObject } from '../ValueObject';
import { EncryptedPrivateKeyLegacy } from './encrypted-private-key/EncryptedPrivateKeyLegacy';
import { EncryptedPrivateKeyV2 } from './encrypted-private-key/EncryptedPrivateKeyV2';
import { EncryptedPrivateKeyV3 } from './encrypted-private-key/EncryptedPrivateKeyV3';
import { PrivateKey } from './PrivateKey';
import { CryptoPassword } from './SymmetricKey';

export class EncryptedPrivateKey extends ValueObject<string> {
  private static readonly versions = [
    new EncryptedPrivateKeyLegacy(),
    new EncryptedPrivateKeyV2(),
    new EncryptedPrivateKeyV3(),
  ];

  public static async create(
    privateKey: PrivateKey,
    password: CryptoPassword,
  ): Promise<EncryptedPrivateKey> {
    const encryptedPrivateKey = await EncryptedPrivateKeyV3.encrypt(
      privateKey,
      password,
    );

    return new EncryptedPrivateKey(encryptedPrivateKey);
  }

  constructor(encryptedPrivateKey: string | StringValueObject) {
    super(encryptedPrivateKey?.valueOf());
  }

  public async decrypt(password: CryptoPassword): Promise<PrivateKey> {
    const parts = this.valueOf().split('.');
    const version = EncryptedPrivateKey.versions.find((handler) =>
      handler.matches(parts),
    );

    assert(version, new InvalidEncryptedPrivateKeyFormatError());

    return version.decrypt(parts, password);
  }

  public needsReEncryption(): boolean {
    const parts = this.valueOf().split('.');
    const version = EncryptedPrivateKey.versions.find((handler) =>
      handler.matches(parts),
    );

    if (!version) {
      return false;
    }

    return version.needsReEncryption();
  }
}
