import { DomainError } from './DomainError';

export class InvalidIntegerError extends DomainError {
  constructor(value: number) {
    super(`Invalid integer value ${value}`);
  }
}
