import { DomainError } from './DomainError';

export class InvalidStringLengthError extends DomainError {
  constructor(value: string, length: number) {
    super(
      `String length '${value.length}' exceeds the expected length: '${length}'`,
    );
  }
}
