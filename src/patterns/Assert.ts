import { BaseError } from '../errors/BaseError';
import { DomainError } from '../errors/DomainError';

export type Errors = Error | BaseError | DomainError | string;

export function assert(
  condition: boolean | unknown | undefined,
  error: string | Errors,
): void {
  if (condition) {
    return;
  }

  throw typeof error === 'string' ? new DomainError(error) : error;
}
