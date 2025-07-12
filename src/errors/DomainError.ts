import { BaseError } from './BaseError';

export class DomainError extends BaseError {
  protected readonly isDomainError = true;
  public static isDomainError(error: unknown): boolean {
    return !!(error as DomainError).isDomainError;
  }

  constructor(message: string) {
    super(message, new.target.prototype);
  }
}
