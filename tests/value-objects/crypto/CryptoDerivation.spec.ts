import * as crypto from 'node:crypto';

import { CryptoDerivation } from '../../../src/value-objects/crypto/encrypted-private-key/CryptoDerivation';

describe('CryptoDerivation', () => {
  it('should derive a key using pbkdf2Async', async () => {
    const salt = crypto.randomBytes(16);
    const key = await CryptoDerivation.pbkdf2Async(
      'secure-password',
      salt,
      100000,
      32,
      'sha256',
    );

    expect(key).toBeInstanceOf(Buffer);
    expect(key).toHaveLength(32);
  });

  it('should derive a key using scryptAsync', async () => {
    const salt = crypto.randomBytes(16);
    const key = await CryptoDerivation.scryptAsync(
      'secure-password',
      salt,
      32,
      {
        N: 16384,
        r: 8,
        p: 1,
      },
    );

    expect(key).toBeInstanceOf(Buffer);
    expect(key).toHaveLength(32);
  });

  it('should reject scryptAsync when parameters are invalid', async () => {
    const salt = crypto.randomBytes(16);
    const mockError = new Error('Mock scrypt error');

    // Create a mock crypto module
    const mockCrypto = {
      ...crypto,
      scrypt: jest.fn((password, salt, keylen, options, callback) => {
        callback(mockError, Buffer.alloc(0));
      }),
    };

    await expect(
      CryptoDerivation.scryptAsync(
        'secure-password',
        salt,
        32,
        {
          N: 16384,
          r: 8,
          p: 1,
        },
        mockCrypto as any,
      ),
    ).rejects.toThrow('Mock scrypt error');
  });

  it('should generate random bytes using randomBytesAsync', async () => {
    const bytes = await CryptoDerivation.randomBytesAsync(16);

    expect(bytes).toBeInstanceOf(Buffer);
    expect(bytes).toHaveLength(16);
  });
});
