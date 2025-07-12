import { DomainError } from './DomainError';

export class InvalidDayFormatError extends DomainError {
  constructor(invalidDate: string) {
    super(`Invalid day ${invalidDate}. Expected YYYY-MM-DD. `);
  }
}
