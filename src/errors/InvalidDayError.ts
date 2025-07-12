import { DomainError } from './DomainError';

export class InvalidDayError extends DomainError {
  constructor(invalidDay: unknown) {
    super(`Invalid day ${String(invalidDay)}`);
  }
}
