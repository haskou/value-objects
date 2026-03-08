import { DomainError } from './DomainError';

export class InvalidHashError extends DomainError {
  constructor(type: string, value: string) {
    super(`Invalid ${type} hash: ${value}`);
  }
}
