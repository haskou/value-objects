import {
  InvalidStringLengthError,
  NullObject,
  StringValueObject,
} from '../../src';

describe('StringValueObject', () => {
  describe('constructor', () => {
    it('should return a NullValueObject when a Nullish is received', () => {
      expect(
        () => new StringValueObject(undefined as unknown as string),
      ).not.toThrow();
      expect(
        NullObject.isNullObject(
          new StringValueObject(undefined as unknown as string),
        ),
      ).toBeTrue();
      expect(
        NullObject.isNullObject(
          new StringValueObject(null as unknown as string),
        ),
      ).toBeTrue();
    });

    it('should work when value is a string', () => {
      expect(new StringValueObject('123').toString()).not.toBeEmpty();
    });

    it('should limit value length', () => {
      expect(() => {
        new StringValueObject('a'.repeat(512));
      }).not.toThrow();
      expect(() => {
        new StringValueObject('a'.repeat(600));
      }).toThrow(InvalidStringLengthError);
    });

    it('should limit value by custom length', () => {
      expect(() => {
        new StringValueObject('1234567890', 9);
      }).toThrow(InvalidStringLengthError);
      expect(() => {
        new StringValueObject('1234567890', 10);
      }).not.toThrow();
      expect(() => {
        new StringValueObject('1234567890', 11);
      }).not.toThrow();
    });

    it('should accept another StringValueObject', () => {
      const original = new StringValueObject('hello');
      const copy = new StringValueObject(original);
      expect(copy.toString()).toEqual('hello');
      expect(copy.isEqual(original)).toBeTrue();
    });

    it('should enforce maxLength when constructed from another StringValueObject', () => {
      const longStr = 'a'.repeat(20);
      const original = new StringValueObject(longStr);
      expect(() => new StringValueObject(original, 10)).toThrow(
        InvalidStringLengthError,
      );
    });
  });

  describe('isEmpty', () => {
    it('should return true when value is empty', () => {
      expect(new StringValueObject('').isEmpty()).toBeTrue();
    });

    it('should return false when value is a string', () => {
      expect(new StringValueObject('123').isEmpty()).toBeFalse();
    });
  });

  describe('inheritance and value object behavior', () => {
    it('should inherit from ValueObject', () => {
      const stringValueObject = new StringValueObject('test');
      expect(stringValueObject).toBeInstanceOf(StringValueObject);
      expect(stringValueObject.valueOf).toBeDefined();
      expect(stringValueObject.isEqual).toBeDefined();
    });

    it('should implement valueOf() method correctly', () => {
      const value = 'test value';
      const stringValueObject = new StringValueObject(value);
      expect(stringValueObject.valueOf()).toBe(value);
    });

    it('should implement isEqual() method correctly', () => {
      const value = 'test value';
      const stringValueObject1 = new StringValueObject(value);
      const stringValueObject2 = new StringValueObject(value);
      const stringValueObject3 = new StringValueObject('different value');

      expect(stringValueObject1.isEqual(stringValueObject2)).toBeTrue();
      expect(stringValueObject1.isEqual(stringValueObject3)).toBeFalse();
      expect(stringValueObject1.isEqual(value)).toBeTrue();
      expect(stringValueObject1.isEqual('different')).toBeFalse();
    });

    it('should compare with primitive values using isEqual', () => {
      const stringValueObject = new StringValueObject('hello');
      expect(stringValueObject.isEqual('hello')).toBeTrue();
      expect(stringValueObject.isEqual('world')).toBeFalse();
    });

    it('should implement clone() method correctly', () => {
      const originalValue = 'test value for cloning';
      const original = new StringValueObject(originalValue);
      const cloned = (original as any).clone();

      expect(cloned).toBeInstanceOf(StringValueObject);
      expect(cloned.valueOf()).toBe(originalValue);
      expect(cloned.toString()).toBe(originalValue);
      expect(cloned.isEqual(original)).toBeTrue();
      expect(cloned).not.toBe(original); // Different instances
    });

    it('should clone with maxLength preservation', () => {
      const original = new StringValueObject('short', 10);
      const cloned = (original as any).clone();

      expect(cloned).toBeInstanceOf(StringValueObject);
      expect(cloned.valueOf()).toBe('short');
      expect(cloned.isEqual(original)).toBeTrue();
      expect(cloned).not.toBe(original);
    });

    it('should implement toString correctly', () => {
      expect(new StringValueObject('').toString()).toBeEmpty();
      expect(new StringValueObject('123').toString()).toEqual('123');
    });
  });
});
