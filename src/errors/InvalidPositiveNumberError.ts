import { DomainError } from './DomainError';

export class InvalidPositiveNumberError extends DomainError {
  constructor() {
    super(`Value must be greater or equal than 0`);
  }
}
