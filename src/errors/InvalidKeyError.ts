import { DomainError } from './DomainError';

export class InvalidKeyError extends DomainError {
  constructor(keySize: number, possibleKeySizes: number[]) {
    super(
      `Invalid key size: ${keySize}. Supported key sizes are ${possibleKeySizes.join(
        ', ',
      )}`,
    );
  }
}
