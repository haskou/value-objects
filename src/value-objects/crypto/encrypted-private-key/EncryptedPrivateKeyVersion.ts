import { StringValueObject } from '../../StringValueObject';
import { PrivateKey } from '../PrivateKey';

export abstract class EncryptedPrivateKeyVersion {
  public abstract matches(parts: string[]): boolean;
  public abstract decrypt(
    parts: string[],
    password: string | StringValueObject,
  ): Promise<PrivateKey>;

  public needsReEncryption(): boolean {
    return false;
  }
}
