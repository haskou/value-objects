import { DomainError } from './DomainError';

export class CurrencyMismatchError extends DomainError {
  constructor(expected: string, received: string) {
    super(`Currency mismatch: expected ${expected}, received ${received}`);
  }
}
