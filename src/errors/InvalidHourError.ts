import { DomainError } from './DomainError';

export class InvalidHourError extends DomainError {
  constructor() {
    super(`Invalid hour`);
  }
}
