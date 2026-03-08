import { DomainError } from '../errors/DomainError';

export class InvalidFormatError extends DomainError {
  constructor(value?: string) {
    super(`Invalid Format Error with value: '${value}'`);
  }
}
