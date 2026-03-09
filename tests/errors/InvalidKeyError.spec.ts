import { InvalidKeyError } from '../../src/errors/InvalidKeyError';
import { DomainError } from '../../src/errors/DomainError';

describe('InvalidKeyError', () => {
  it('should be an instance of DomainError', () => {
    const error = new InvalidKeyError(128, [256, 512]);
    expect(error).toBeInstanceOf(DomainError);
  });

  it('should contain the invalid key size and possible sizes in the message', () => {
    const error = new InvalidKeyError(128, [256, 512]);
    expect(error.message).toBe(
      'Invalid key size: 128. Supported key sizes are 256, 512',
    );
  });
});
