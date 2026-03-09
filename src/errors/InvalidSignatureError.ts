import { DomainError } from './DomainError';

export class InvalidSignatureError extends DomainError {
  constructor(length: number) {
    super(`Signature must be a ${length}-character string`);
  }
}
