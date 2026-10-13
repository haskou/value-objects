import {
  Integer,
  InvalidIntegerError,
  InvalidNumberError,
  InvalidPositiveNumberError,
  NullObject,
  PositiveInteger,
  PositiveNumber,
} from '../../src';

describe('PositiveInteger', () => {
  describe('constructor', () => {
    it('should return a NullObject when a Nullish is received', () => {
      expect(
        NullObject.isNullObject(
          new PositiveInteger(undefined as unknown as number),
        ),
      ).toBeTrue();
      expect(
        NullObject.isNullObject(new PositiveInteger(null as unknown as number)),
      ).toBeTrue();
    });

    it('should accept 0 and positive integers', () => {
      expect(new PositiveInteger(0).valueOf()).toBe(0);
      expect(new PositiveInteger(7).valueOf()).toBe(7);
    });

    it('should reject negative integers', () => {
      expect(() => new PositiveInteger(-1)).toThrow(InvalidPositiveNumberError);
      expect(() => new PositiveInteger(-1)).toThrow(
        'Value must be greater or equal than 0',
      );
    });

    it('should reject non-integer values', () => {
      expect(() => new PositiveInteger(1.5)).toThrow(InvalidIntegerError);
      expect(() => new PositiveInteger(-0.5)).toThrow(
        InvalidPositiveNumberError,
      );
    });

    it('should reject NaN and infinite values', () => {
      expect(() => new PositiveInteger(NaN)).toThrow(InvalidNumberError);
      expect(() => new PositiveInteger(Infinity)).toThrow(InvalidNumberError);
    });

    it('should accept another PositiveInteger', () => {
      const original = new PositiveInteger(42);
      const copy = new PositiveInteger(original);

      expect(copy.valueOf()).toBe(42);
      expect(copy.isEqual(original)).toBeTrue();
    });
  });

  describe('inheritance', () => {
    it('should inherit from PositiveNumber', () => {
      expect(new PositiveInteger(1)).toBeInstanceOf(PositiveNumber);
    });

    it('should not inherit from Integer', () => {
      expect(new PositiveInteger(1)).not.toBeInstanceOf(Integer);
    });

    it('should not be equal to an Integer with the same value', () => {
      expect(new PositiveInteger(1).isEqual(new Integer(1))).toBeFalse();
    });
  });

  describe('arithmetic', () => {
    it('should keep returning PositiveInteger', () => {
      const result = new PositiveInteger(6).subtract(2).multiply(2);

      expect(result).toBeInstanceOf(PositiveInteger);
      expect(result.valueOf()).toBe(8);
    });

    it('should throw when the result is negative', () => {
      expect(() => new PositiveInteger(1).subtract(2)).toThrow(
        InvalidPositiveNumberError,
      );
    });

    it('should throw when the result is not an integer', () => {
      expect(() => new PositiveInteger(3).divide(2)).toThrow(
        InvalidIntegerError,
      );
    });
  });
});
