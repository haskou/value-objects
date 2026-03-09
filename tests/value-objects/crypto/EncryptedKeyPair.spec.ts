import {
  EncryptedKeyPair,
  EncryptedPrivateKey,
  KeyPair,
  PublicKey,
  Signature,
  StringValueObject,
} from '../../../src';

describe('EncryptedKeyPair', () => {
  let keyPair: KeyPair;
  const password = 'encryption-password';

  beforeAll(async () => {
    keyPair = KeyPair.generate();
  });

  describe('constructor', () => {
    it('should accept PublicKey and EncryptedPrivateKey instances', () => {
      const primitives = keyPair.toPrimitives();
      const publicKey = new PublicKey(primitives.publicKey);
      const encryptedPrivateKey = new EncryptedPrivateKey('enc.priv.key.tag');

      const pair = new EncryptedKeyPair(publicKey, encryptedPrivateKey);

      expect(pair).toBeInstanceOf(EncryptedKeyPair);
    });
  });

  describe('encryptKeyPair', () => {
    it('should create an EncryptedKeyPair from a PublicKey and PrivateKey', async () => {
      const primitives = keyPair.toPrimitives();
      const encrypted = await keyPair.encryptKeyPair(password);

      expect(encrypted).toBeInstanceOf(EncryptedKeyPair);
      expect(encrypted.toPrimitives().publicKey).toBe(primitives.publicKey);
    });

    it('should accept a StringValueObject as password', async () => {
      const passwordVO = new StringValueObject(password);
      const encrypted = await keyPair.encryptKeyPair(passwordVO);

      expect(encrypted).toBeInstanceOf(EncryptedKeyPair);
    });
  });

  describe('toPrimitives', () => {
    it('should return an object with publicKey and encryptedPrivateKey', async () => {
      const encrypted = await keyPair.encryptKeyPair(password);
      const primitives = encrypted.toPrimitives();

      expect(primitives).toHaveProperty('publicKey');
      expect(primitives).toHaveProperty('encryptedPrivateKey');
      expect(primitives.publicKey).toContain('BEGIN PUBLIC KEY');
      expect(primitives.encryptedPrivateKey.split('.')).toHaveLength(4);
    });
  });

  describe('fromPrimitives', () => {
    it('should recreate an EncryptedKeyPair from primitives', async () => {
      const encrypted = await keyPair.encryptKeyPair(password);
      const primitives = encrypted.toPrimitives();

      const recreated = EncryptedKeyPair.fromPrimitives(primitives);

      expect(recreated).toBeInstanceOf(EncryptedKeyPair);
    });

    it('should preserve values in the round-trip', async () => {
      const encrypted = await keyPair.encryptKeyPair(password);
      const primitives = encrypted.toPrimitives();

      const recreated = EncryptedKeyPair.fromPrimitives(primitives);
      const recreatedPrimitives = recreated.toPrimitives();

      expect(recreatedPrimitives.publicKey).toBe(primitives.publicKey);
      expect(recreatedPrimitives.encryptedPrivateKey).toBe(
        primitives.encryptedPrivateKey,
      );
    });

    it('should produce functional EncryptedKeyPair after round-trip', async () => {
      const encrypted = await keyPair.encryptKeyPair(password);
      const primitives = encrypted.toPrimitives();

      const recreated = EncryptedKeyPair.fromPrimitives(primitives);
      const payload = 'verify after round-trip';
      const sig = recreated.sign(payload, password);

      expect(recreated.isValidSignature(payload, sig)).toBeTrue();
    });
  });

  describe('sign', () => {
    it('should produce a valid Signature', async () => {
      const encrypted = await keyPair.encryptKeyPair(password);
      const sig = encrypted.sign('hello world', password);

      expect(sig).toBeInstanceOf(Signature);
      expect(sig.valueOf()).toHaveLength(88);
    });

    it('should accept a StringValueObject as password', async () => {
      const encrypted = await keyPair.encryptKeyPair(password);
      const passwordVO = new StringValueObject(password);
      const sig = encrypted.sign('data', passwordVO);

      expect(sig).toBeInstanceOf(Signature);
    });

    it('should produce different signatures for different payloads', async () => {
      const encrypted = await keyPair.encryptKeyPair(password);
      const sig1 = encrypted.sign('msg-a', password);
      const sig2 = encrypted.sign('msg-b', password);

      expect(sig1.isEqual(sig2)).toBeFalse();
    });
  });

  describe('isValidSignature', () => {
    it('should return true for a valid signature', async () => {
      const encrypted = await keyPair.encryptKeyPair(password);
      const payload = 'signed data';
      const sig = encrypted.sign(payload, password);

      expect(encrypted.isValidSignature(payload, sig)).toBeTrue();
    });

    it('should return false for a tampered payload', async () => {
      const encrypted = await keyPair.encryptKeyPair(password);
      const sig = encrypted.sign('original', password);

      expect(encrypted.isValidSignature('tampered', sig)).toBeFalse();
    });

    it('should return false for a wrong signature', async () => {
      const encrypted = await keyPair.encryptKeyPair(password);
      const otherPair = await KeyPair.generate();
      const otherEncrypted = await otherPair.encryptKeyPair(password);
      const sig = otherEncrypted.sign('message', password);

      expect(encrypted.isValidSignature('message', sig)).toBeFalse();
    });

    it('should verify signatures produced by the original KeyPair', async () => {
      const encrypted = await keyPair.encryptKeyPair(password);
      const payload = 'cross-verify';
      const sig = keyPair.sign(payload);

      expect(encrypted.isValidSignature(payload, sig)).toBeTrue();
    });
  });
});
