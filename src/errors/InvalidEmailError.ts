import { DomainError } from './DomainError';

export class InvalidEmailError extends DomainError {
  constructor(value: string) {
    super(`Invalid email format: ${value}`);
  }
}
