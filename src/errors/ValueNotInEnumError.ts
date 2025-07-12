import { DomainError } from './DomainError';

export class ValueNotInEnumError extends DomainError {
  constructor(value: unknown, enumerate: unknown) {
    super(
      `${Object.values(enumerate as object).join(',')} enum does not include value: ${value}`,
    );
  }
}
