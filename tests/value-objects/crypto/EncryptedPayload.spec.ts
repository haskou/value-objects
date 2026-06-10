import {
  AsymmetricEncryptedPayload,
  EncryptedPayload,
  NullObject,
  StringValueObject,
  SymmetricEncryptedPayload,
} from '../../../src';

describe('EncryptedPayload', () => {
  describe('constructor', () => {
    it('should return a NullValueObject when receiving nullish', () => {
      const payload = new EncryptedPayload(undefined as unknown as string);
      expect(NullObject.isNullObject(payload)).toBeTrue();
    });

    it('should store a string value verbatim', () => {
      const payload = new EncryptedPayload('some-data');
      expect(payload.isEqual('some-data')).toBeTrue();
      expect(payload.toString()).toBe('some-data');
    });
  });

  describe('getScheme', () => {
    it('should identify legacy asymmetric payloads', () => {
      const payload = new EncryptedPayload('eph.iv.cipher.tag');

      expect(payload.getScheme()).toBe('asymmetric');
    });

    it('should identify versioned asymmetric payloads', () => {
      const payload = new EncryptedPayload(
        'v2.x25519-hkdf-sha256-aes-256-gcm.eph.iv.cipher.tag',
      );

      expect(payload.getScheme()).toBe('asymmetric');
    });

    it('should identify symmetric payloads', () => {
      const payload = new EncryptedPayload('v1.aes-256-gcm.iv.cipher.tag');

      expect(payload.getScheme()).toBe('symmetric');
    });

    it('should return unknown for unsupported payload formats', () => {
      const payload = new EncryptedPayload('some-data');

      expect(payload.getScheme()).toBe('unknown');
    });

    it('should return unknown for incomplete symmetric payload formats', () => {
      const payload = new EncryptedPayload('v1.aes-256-gcm');

      expect(payload.getScheme()).toBe('unknown');
    });

    it('should allow subclasses to expose their fixed scheme', () => {
      const asymmetric = new AsymmetricEncryptedPayload('some-data');
      const symmetric = new SymmetricEncryptedPayload('some-data');

      expect(asymmetric).toBeInstanceOf(EncryptedPayload);
      expect(symmetric).toBeInstanceOf(EncryptedPayload);
      expect(asymmetric.getScheme()).toBe('asymmetric');
      expect(symmetric.getScheme()).toBe('symmetric');
    });
  });

  describe('inheritance and ValueObject behavior', () => {
    it('should inherit from ValueObject', () => {
      const payload = new EncryptedPayload('data');
      expect(payload).toBeInstanceOf(EncryptedPayload);
      expect(payload.valueOf).toBeDefined();
      expect(payload.isEqual).toBeDefined();
      expect(payload.toString).toBeDefined();
    });

    it('should implement valueOf() method correctly', () => {
      const data = 'payload-value';
      const payload = new EncryptedPayload(data);
      expect(payload.valueOf()).toBe(data);
    });

    it('should implement toString() method correctly', () => {
      const data = 'payload-string';
      const payload = new EncryptedPayload(data);
      expect(payload.toString()).toBe(data);
    });

    it('should implement isEqual() method correctly', () => {
      const data = 'encrypted';
      const payload1 = new EncryptedPayload(data);
      const payload2 = new EncryptedPayload(data);
      const payload3 = new EncryptedPayload('different');

      expect(payload1.isEqual(payload2)).toBeTrue();
      expect(payload1.isEqual(payload3)).toBeFalse();
      expect(payload1.isEqual(data)).toBeTrue();
      expect(payload1.isEqual('different')).toBeFalse();
    });

    it('should compare with string values using isEqual', () => {
      const payload = new EncryptedPayload('secret');
      expect(payload.isEqual('secret')).toBeTrue();
      expect(payload.isEqual('public')).toBeFalse();
    });

    it('should implement clone() method correctly inherited from ValueObject', () => {
      const originalValue = 'original-encrypted';
      const original = new EncryptedPayload(originalValue);
      const cloned = (original as any).clone();

      expect(cloned).toBeInstanceOf(EncryptedPayload);
      expect(cloned.valueOf()).toBe(originalValue);
      expect(cloned.toString()).toBe(originalValue);
      expect(cloned.isEqual(original)).toBeTrue();
      expect(cloned).not.toBe(original); // Different instances
    });
  });
});
