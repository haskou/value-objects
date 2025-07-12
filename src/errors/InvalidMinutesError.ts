import { DomainError } from './DomainError';

export class InvalidMinutesError extends DomainError {
  constructor() {
    super(`Invalid minutes`);
  }
}
