import { DomainError } from './DomainError';

export class InvalidLatitudeError extends DomainError {
  constructor(value: number) {
    super(`Invalid latitude: ${value}. Must be between -90 and 90`);
  }
}
