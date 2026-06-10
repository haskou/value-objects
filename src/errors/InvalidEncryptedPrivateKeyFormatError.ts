import { DomainError } from './DomainError';

export class InvalidEncryptedPrivateKeyFormatError extends DomainError {
  constructor(reason = 'Invalid encrypted private key format') {
    super(reason);
  }
}
