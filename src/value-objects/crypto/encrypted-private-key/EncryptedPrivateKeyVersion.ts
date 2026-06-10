import { PrivateKey } from '../PrivateKey';
import { CryptoPassword } from '../SymmetricKey';

export abstract class EncryptedPrivateKeyVersion {
  public abstract matches(parts: string[]): boolean;
  public abstract decrypt(
    parts: string[],
    password: CryptoPassword,
  ): Promise<PrivateKey>;

  public needsReEncryption(): boolean {
    return false;
  }
}
