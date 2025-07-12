import { DomainError } from './DomainError';

export class InvalidLongitudeError extends DomainError {
  constructor(value: number) {
    super(`Invalid longitude: ${value}. Must be between -180 and 180`);
  }
}
