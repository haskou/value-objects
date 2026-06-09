import { ValueObject } from '../ValueObject';

export type EncryptedPayloadScheme = 'asymmetric' | 'symmetric' | 'unknown';

export class EncryptedPayload extends ValueObject<string> {
  public getScheme(): EncryptedPayloadScheme {
    const parts = this.valueOf().split('.');

    if (parts.length === 4) {
      return 'asymmetric';
    }

    if (parts.length === 5 && parts[0] === 'v1' && parts[1] === 'aes-256-gcm') {
      return 'symmetric';
    }

    return 'unknown';
  }
}
