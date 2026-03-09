import { EncryptedPayload, NullObject, StringValueObject } from '../../../src';

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
