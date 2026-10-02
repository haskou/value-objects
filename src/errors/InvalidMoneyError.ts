import { DomainError } from './DomainError';

export class InvalidMoneyError extends DomainError {
  constructor(value: unknown) {
    super(`Invalid money ${String(value)}`);
  }
}
