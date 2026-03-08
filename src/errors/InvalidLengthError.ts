import { DomainError } from './DomainError';

export class InvalidLengthError extends DomainError {
  constructor(value: unknown, length: number) {
    super(
      `Invalid Length Error with value: '${value}' expected length: '${length}'`,
    );
  }
}
