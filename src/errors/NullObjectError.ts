import { DomainError } from './DomainError';

export class NullObjectError extends DomainError {
  constructor(message: string) {
    super(`[NullObjectError]: ${message} is NullObject`);
    Object.setPrototypeOf(this, NullObjectError.prototype);
  }
}
