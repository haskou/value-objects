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

  it('should derive a key using pbkdf2Async with injected crypto module', async () => {
    const salt = Buffer.from('aabbccddeeff00112233445566778899', 'hex');
    const expectedKey = Buffer.from('0123456789abcdef0123456789abcdef', 'hex');
    const mockCrypto = {
      ...crypto,
      pbkdf2: jest.fn(
        (password, saltArg, iterations, keyLength, algorithm, callback) => {
          expect(password).toBe('secure-password');
          expect(saltArg).toEqual(salt);
          expect(iterations).toBe(100000);
          expect(keyLength).toBe(32);
          expect(algorithm).toBe('sha256');
          callback(null, expectedKey);
        },
      ),
    } as unknown as typeof crypto;

    const key = await CryptoDerivation.pbkdf2Async(
      'secure-password',
      salt,
      100000,
      32,
      'sha256',
      mockCrypto,
    );

    expect(key).toBe(expectedKey);
    expect(mockCrypto.pbkdf2).toHaveBeenCalled();
  });

  it('should generate random bytes using randomBytesAsync with injected crypto module', async () => {
    const expectedBytes = Buffer.alloc(16, 0xab);
    const mockCrypto = {
      ...crypto,
      randomBytes: jest.fn((size, callback) => {
        expect(size).toBe(16);
        callback(null, expectedBytes);
      }),
    } as unknown as typeof crypto;

    const bytes = await CryptoDerivation.randomBytesAsync(16, mockCrypto);

    expect(bytes).toEqual(expectedBytes);
    expect(mockCrypto.randomBytes).toHaveBeenCalled();
  });
});
