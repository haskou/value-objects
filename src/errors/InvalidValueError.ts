import { DomainError } from './DomainError';

export class InvalidValueError extends DomainError {
  constructor(message: string = 'Invalid Value Error', value?: unknown) {
    super(`${message} with value: '${value}'`);
  }
}
