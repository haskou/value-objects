import { EncryptedPayload, EncryptedPayloadScheme } from './EncryptedPayload';

export class SymmetricEncryptedPayload extends EncryptedPayload {
  public getScheme(): EncryptedPayloadScheme {
    return 'symmetric';
  }
}
