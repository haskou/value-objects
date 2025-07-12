import { DomainError } from './DomainError';

export class InvalidColorError extends DomainError {
  constructor(value: string) {
    super(`Invalid color value: ${value}. Must be a valid hex color code.`);
  }
}
