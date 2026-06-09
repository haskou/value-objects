import { EncryptedPayload, EncryptedPayloadScheme } from './EncryptedPayload';

export class AsymmetricEncryptedPayload extends EncryptedPayload {
  public getScheme(): EncryptedPayloadScheme {
    return 'asymmetric';
  }
}
