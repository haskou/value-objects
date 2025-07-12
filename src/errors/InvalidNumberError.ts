import { DomainError } from './DomainError';

export class InvalidNumberError extends DomainError {
  constructor(invalidNumber: unknown) {
    super(`Invalid number ${String(invalidNumber)}`);
  }
}
