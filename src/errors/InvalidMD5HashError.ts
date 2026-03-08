import { DomainError } from './DomainError';

export class InvalidMD5HashError extends DomainError {
  constructor(value: string) {
    super(`Invalid MD5 hash: ${value}`);
  }
}
