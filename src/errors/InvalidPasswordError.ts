import { DomainError } from './DomainError';

export class InvalidPasswordError extends DomainError {
  constructor(minLength: number, maxLength: number) {
    super(
      `Password must be between ${minLength} and ${maxLength} characters long and include at least one uppercase letter, one lowercase letter, one number and one symbol.`,
    );
  }
}
