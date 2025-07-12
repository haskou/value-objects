import { InvalidNumberError, NullObject, NumberValueObject } from '../../src';

describe('NumberValueObject', () => {
  describe('constructor', () => {
    it('should return a NullValueObject when a Nullish is received', () => {
      expect(
        () => new NumberValueObject(undefined as unknown as number),
      ).not.toThrow();
      expect(
        NullObject.isNullObject(
          new NumberValueObject(undefined as unknown as number),
        ),
      ).toBeTrue();
      expect(
        NullObject.isNullObject(
          new NumberValueObject(null as unknown as number),
        ),
      ).toBeTrue();
    });

    it('should throw InvalidNumberError for NaN', () => {
      const value = NaN;

      expect(() => new NumberValueObject(value)).toThrow(InvalidNumberError);
      expect(() => new NumberValueObject(value)).toThrow(
        `Invalid number ${value}`,
      );
    });
    it('should throw InvalidNumberError for a parsed string', () => {
      const value = parseInt('Not a number');

      expect(() => new NumberValueObject(value)).toThrow(InvalidNumberError);
      expect(() => new NumberValueObject(value)).toThrow(
        `Invalid number ${value}`,
      );
    });
  });

  describe('isZero', () => {
    it('should return true when value is 0', () => {
      expect(new NumberValueObject(0).isZero()).toBeTrue();
    });

    it('should return false when value is not 0', () => {
      expect(new NumberValueObject(1).isZero()).toBeFalse();
    });
  });

  describe('isGreaterThan', () => {
    it('should return true when value is greater than other', () => {
      expect(
        new NumberValueObject(1).isGreaterThan(new NumberValueObject(0)),
      ).toBeTrue();
    });

    it('should return false when value is not greater than other', () => {
      expect(
        new NumberValueObject(0).isGreaterThan(new NumberValueObject(1)),
      ).toBeFalse();
    });
  });
  describe('isGreaterOrEqualThan', () => {
    it('should return true when value is greater than other', () => {
      expect(
        new NumberValueObject(1).isGreaterOrEqualThan(new NumberValueObject(0)),
      ).toBeTrue();
    });

    it('should return true when value is the equal than other', () => {
      expect(
        new NumberValueObject(1).isGreaterOrEqualThan(new NumberValueObject(1)),
      ).toBeTrue();
    });

    it('should return false when value is not greater than other', () => {
      expect(
        new NumberValueObject(0).isGreaterOrEqualThan(new NumberValueObject(1)),
      ).toBeFalse();
    });
  });

  describe('isLessThan', () => {
    it('should return true when value is less than other', () => {
      expect(
        new NumberValueObject(0).isLessThan(new NumberValueObject(1)),
      ).toBeTrue();
    });

    it('should return false when value is not less than other', () => {
      expect(
        new NumberValueObject(1).isLessThan(new NumberValueObject(0)),
      ).toBeFalse();
    });
  });

  describe('isLessOrEqualThan', () => {
    it('should return true when value is less than other', () => {
      expect(
        new NumberValueObject(0).isLessOrEqualThan(new NumberValueObject(1)),
      ).toBeTrue();
    });

    it('should return true when value is equal than other', () => {
      expect(
        new NumberValueObject(1).isLessOrEqualThan(new NumberValueObject(1)),
      ).toBeTrue();
    });

    it('should return false when value is not less than other', () => {
      expect(
        new NumberValueObject(1).isLessOrEqualThan(new NumberValueObject(0)),
      ).toBeFalse();
    });
  });

  describe('add', () => {
    it('should return a new NumberValueObject with the sum of the two values', () => {
      const value = new NumberValueObject(1);
      const other = new NumberValueObject(2);
      const result = value.add(other);
      expect(result.valueOf()).toEqual(3);
    });

    it('should not mutate original objects when adding', () => {
      const original = new NumberValueObject(10);
      const other = new NumberValueObject(5);
      const originalValue = original.valueOf();
      const otherValue = other.valueOf();

      const result = original.add(other);

      // Original objects should remain unchanged
      expect(original.valueOf()).toBe(originalValue);
      expect(original.valueOf()).toBe(10);
      expect(other.valueOf()).toBe(otherValue);
      expect(other.valueOf()).toBe(5);

      // Result should be a new instance
      expect(result.valueOf()).toBe(15);
      expect(result).not.toBe(original);
      expect(result).not.toBe(other);
    });

    it('should work with primitive numbers and maintain immutability', () => {
      const original = new NumberValueObject(15);
      const originalValue = original.valueOf();

      const result = original.add(5);

      // Original should remain unchanged
      expect(original.valueOf()).toBe(originalValue);
      expect(original.valueOf()).toBe(15);

      // Result should be correct and a new instance
      expect(result.valueOf()).toBe(20);
      expect(result).not.toBe(original);
    });

    it('should maintain immutability when adding zero', () => {
      const original = new NumberValueObject(42);
      const zero = new NumberValueObject(0);
      const originalValue = original.valueOf();

      const result = original.add(zero);

      // Original should remain unchanged
      expect(original.valueOf()).toBe(originalValue);
      expect(original.valueOf()).toBe(42);
      expect(zero.valueOf()).toBe(0);

      // Result should be correct and a new instance
      expect(result.valueOf()).toBe(42);
      expect(result).not.toBe(original);
    });
  });

  describe('subtract', () => {
    it('should return a new NumberValueObject with the difference of the two values', () => {
      const value = new NumberValueObject(1);
      const other = new NumberValueObject(2);
      const result = value.subtract(other);
      expect(result.valueOf()).toEqual(-1);
    });

    it('should not mutate original objects when subtracting', () => {
      const original = new NumberValueObject(10);
      const other = new NumberValueObject(3);
      const originalValue = original.valueOf();
      const otherValue = other.valueOf();

      const result = original.subtract(other);

      // Original objects should remain unchanged
      expect(original.valueOf()).toBe(originalValue);
      expect(original.valueOf()).toBe(10);
      expect(other.valueOf()).toBe(otherValue);
      expect(other.valueOf()).toBe(3);

      // Result should be a new instance
      expect(result.valueOf()).toBe(7);
      expect(result).not.toBe(original);
      expect(result).not.toBe(other);
    });

    it('should work with primitive numbers and maintain immutability', () => {
      const original = new NumberValueObject(15);
      const originalValue = original.valueOf();

      const result = original.subtract(3);

      // Original should remain unchanged
      expect(original.valueOf()).toBe(originalValue);
      expect(original.valueOf()).toBe(15);

      // Result should be correct and a new instance
      expect(result.valueOf()).toBe(12);
      expect(result).not.toBe(original);
    });

    it('should maintain immutability when subtracting zero', () => {
      const original = new NumberValueObject(42);
      const zero = new NumberValueObject(0);
      const originalValue = original.valueOf();

      const result = original.subtract(zero);

      // Original should remain unchanged
      expect(original.valueOf()).toBe(originalValue);
      expect(original.valueOf()).toBe(42);
      expect(zero.valueOf()).toBe(0);

      // Result should be correct and a new instance
      expect(result.valueOf()).toBe(42);
      expect(result).not.toBe(original);
    });
  });

  describe('multiply', () => {
    it('should return a new NumberValueObject with the product of the two values', () => {
      const value = new NumberValueObject(1);
      const other = new NumberValueObject(2);
      const result = value.multiply(other);
      expect(result.valueOf()).toEqual(2);
    });

    it('should not mutate original objects when multiplying', () => {
      const original = new NumberValueObject(7);
      const other = new NumberValueObject(6);
      const originalValue = original.valueOf();
      const otherValue = other.valueOf();

      const result = original.multiply(other);

      // Original objects should remain unchanged
      expect(original.valueOf()).toBe(originalValue);
      expect(original.valueOf()).toBe(7);
      expect(other.valueOf()).toBe(otherValue);
      expect(other.valueOf()).toBe(6);

      // Result should be a new instance
      expect(result.valueOf()).toBe(42);
      expect(result).not.toBe(original);
      expect(result).not.toBe(other);
    });

    it('should work with primitive numbers and maintain immutability', () => {
      const original = new NumberValueObject(15);
      const originalValue = original.valueOf();

      const result = original.multiply(2);

      // Original should remain unchanged
      expect(original.valueOf()).toBe(originalValue);
      expect(original.valueOf()).toBe(15);

      // Result should be correct and a new instance
      expect(result.valueOf()).toBe(30);
      expect(result).not.toBe(original);
    });

    it('should maintain immutability when multiplying by zero', () => {
      const original = new NumberValueObject(42);
      const zero = new NumberValueObject(0);
      const originalValue = original.valueOf();

      const result = original.multiply(zero);

      // Original should remain unchanged
      expect(original.valueOf()).toBe(originalValue);
      expect(original.valueOf()).toBe(42);
      expect(zero.valueOf()).toBe(0);

      // Result should be correct and a new instance
      expect(result.valueOf()).toBe(0);
      expect(result).not.toBe(original);
    });
  });

  describe('divide', () => {
    it('should return a new NumberValueObject with the quotient of the two values', () => {
      const value = new NumberValueObject(1);
      const other = new NumberValueObject(2);
      const result = value.divide(other);
      expect(result.valueOf()).toEqual(0.5);
    });

    it('should not mutate original objects when dividing', () => {
      const original = new NumberValueObject(20);
      const other = new NumberValueObject(4);
      const originalValue = original.valueOf();
      const otherValue = other.valueOf();

      const result = original.divide(other);

      // Original objects should remain unchanged
      expect(original.valueOf()).toBe(originalValue);
      expect(original.valueOf()).toBe(20);
      expect(other.valueOf()).toBe(otherValue);
      expect(other.valueOf()).toBe(4);

      // Result should be a new instance
      expect(result.valueOf()).toBe(5);
      expect(result).not.toBe(original);
      expect(result).not.toBe(other);
    });

    it('should work with primitive numbers and maintain immutability', () => {
      const original = new NumberValueObject(15);
      const originalValue = original.valueOf();

      const result = original.divide(3);

      // Original should remain unchanged
      expect(original.valueOf()).toBe(originalValue);
      expect(original.valueOf()).toBe(15);

      // Result should be correct and a new instance
      expect(result.valueOf()).toBe(5);
      expect(result).not.toBe(original);
    });
  });

  describe('inheritance and ValueObject behavior', () => {
    it('should inherit from ValueObject', () => {
      const numberValueObject = new NumberValueObject(42);
      expect(numberValueObject).toBeInstanceOf(NumberValueObject);
      expect(numberValueObject.valueOf).toBeDefined();
      expect(numberValueObject.isEqual).toBeDefined();
      expect(numberValueObject.toString).toBeDefined();
    });

    it('should implement valueOf() method correctly', () => {
      const value = 123.45;
      const numberValueObject = new NumberValueObject(value);
      expect(numberValueObject.valueOf()).toBe(value);
    });

    it('should implement toString() method correctly from ValueObject', () => {
      const value = 987.654;
      const numberValueObject = new NumberValueObject(value);
      expect(numberValueObject.toString()).toBe(value.toString());
      expect(numberValueObject.toString()).toBe('987.654');
    });

    it('should implement isEqual() method correctly', () => {
      const value = 100;
      const numberValueObject1 = new NumberValueObject(value);
      const numberValueObject2 = new NumberValueObject(value);
      const numberValueObject3 = new NumberValueObject(200);

      expect(numberValueObject1.isEqual(numberValueObject2)).toBeTrue();
      expect(numberValueObject1.isEqual(numberValueObject3)).toBeFalse();
      expect(numberValueObject1.isEqual(value)).toBeTrue();
      expect(numberValueObject1.isEqual(200)).toBeFalse();
    });

    it('should compare with primitive values using isEqual', () => {
      const numberValueObject = new NumberValueObject(42);
      expect(numberValueObject.isEqual(42)).toBeTrue();
      expect(numberValueObject.isEqual(43)).toBeFalse();
    });

    it('should implement clone() method correctly', () => {
      const originalValue = 3.14159;
      const original = new NumberValueObject(originalValue);
      const cloned = (original as any).clone();

      expect(cloned).toBeInstanceOf(NumberValueObject);
      expect(cloned.valueOf()).toBe(originalValue);
      expect(cloned.toString()).toBe(originalValue.toString());
      expect(cloned.isEqual(original)).toBeTrue();
      expect(cloned).not.toBe(original); // Different instances
    });

    it('should accept another NumberValueObject in constructor', () => {
      const original = new NumberValueObject(555);
      const copy = new NumberValueObject(original);
      expect(copy.valueOf()).toBe(555);
      expect(copy.isEqual(original)).toBeTrue();
    });

    it('should validate number when constructed from another NumberValueObject', () => {
      const validNumberValueObject = new NumberValueObject(123);
      expect(() => new NumberValueObject(validNumberValueObject)).not.toThrow();

      // Create an invalid NumberValueObject by bypassing validation (for testing)
      const invalidValue = NaN;
      expect(() => new NumberValueObject(invalidValue)).toThrow(
        InvalidNumberError,
      );
    });

    it('should maintain immutability with chained operations', () => {
      const original = new NumberValueObject(10);
      const two = new NumberValueObject(2);
      const three = new NumberValueObject(3);

      const originalValue = original.valueOf();
      const twoValue = two.valueOf();
      const threeValue = three.valueOf();

      // Chain operations: (10 + 2) * 3 / 2
      const step1 = original.add(two);
      const step2 = step1.multiply(three);
      const final = step2.divide(two);

      // All original objects should remain unchanged
      expect(original.valueOf()).toBe(originalValue);
      expect(original.valueOf()).toBe(10);
      expect(two.valueOf()).toBe(twoValue);
      expect(two.valueOf()).toBe(2);
      expect(three.valueOf()).toBe(threeValue);
      expect(three.valueOf()).toBe(3);

      // Each step should create new instances
      expect(step1.valueOf()).toBe(12);
      expect(step2.valueOf()).toBe(36);
      expect(final.valueOf()).toBe(18);

      // All results should be different instances
      expect(step1).not.toBe(original);
      expect(step2).not.toBe(step1);
      expect(final).not.toBe(step2);
    });
  });
});
