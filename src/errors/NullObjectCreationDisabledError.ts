import { DomainError } from './DomainError';

export class NullObjectCreationDisabledError extends DomainError {
  constructor(valueObjectName: string) {
    super(
      `[NullObjectCreationDisabledError]: ${valueObjectName} received null or undefined while automatic NullObject creation is disabled`,
    );
    Object.setPrototypeOf(this, NullObjectCreationDisabledError.prototype);
  }
}
