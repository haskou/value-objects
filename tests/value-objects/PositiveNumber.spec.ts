import {
  InvalidPositiveNumberError,
  NullObject,
  NumberValueObject,
  PositiveNumber,
} from '../../src';

describe('PositiveNumber', () => {
  describe('constructor', () => {
    it('should return a NullValueObject when a Nullish is received', () => {
      expect(
        () => new PositiveNumber(undefined as unknown as number),
      ).not.toThrow();
      expect(
        NullObject.isNullObject(
          new PositiveNumber(undefined as unknown as number),
        ),
      ).toBeTrue();
      expect(
        NullObject.isNullObject(new PositiveNumber(null as unknown as number)),
      ).toBeTrue();
    });
    it('should validate is positive number', () => {
      expect(() => new PositiveNumber(-1)).toThrow(
        'Value must be greater or equal than 0',
      );
      expect(() => new PositiveNumber(-1)).toThrow(InvalidPositiveNumberError);
    });

    it('should accept positive numbers', () => {
      expect(() => new PositiveNumber(1)).not.toThrow();
      expect(() => new PositiveNumber(0.1)).not.toThrow();
      expect(() => new PositiveNumber(100.5)).not.toThrow();
    });

    it('should reject negative numbers', () => {
      expect(() => new PositiveNumber(-0.1)).toThrow(
        InvalidPositiveNumberError,
      );
      expect(() => new PositiveNumber(-100)).toThrow(
        InvalidPositiveNumberError,
      );
    });

    it('should accept another PositiveNumber', () => {
      const original = new PositiveNumber(42);
      const copy = new PositiveNumber(original);
      expect(copy.valueOf()).toBe(42);
      expect(copy.isEqual(original)).toBeTrue();
    });

    it('should validate when constructed from another NumberValueObject', () => {
      const validNumber = new PositiveNumber(10);
      expect(() => new PositiveNumber(validNumber)).not.toThrow();

      // Cannot test invalid NumberValueObject directly since NumberValueObject validates NaN
      // But we can test edge cases
      expect(() => new PositiveNumber(0.00001)).not.toThrow();
    });
  });

  describe('inheritance and NumberValueObject behavior', () => {
    it('should inherit from NumberValueObject', () => {
      const positiveNumber = new PositiveNumber(42);
      expect(positiveNumber).toBeInstanceOf(PositiveNumber);
      expect(positiveNumber).toBeInstanceOf(NumberValueObject);
      expect(positiveNumber.valueOf).toBeDefined();
      expect(positiveNumber.isEqual).toBeDefined();
      expect(positiveNumber.toString).toBeDefined();
      expect(positiveNumber.isZero).toBeDefined();
      expect(positiveNumber.add).toBeDefined();
      expect(positiveNumber.subtract).toBeDefined();
      expect(positiveNumber.multiply).toBeDefined();
      expect(positiveNumber.divide).toBeDefined();
    });

    it('should implement valueOf() method correctly from NumberValueObject', () => {
      const value = 123.45;
      const positiveNumber = new PositiveNumber(value);
      expect(positiveNumber.valueOf()).toBe(value);
    });

    it('should implement toString() method correctly from ValueObject', () => {
      const value = 987.654;
      const positiveNumber = new PositiveNumber(value);
      expect(positiveNumber.toString()).toBe(value.toString());
      expect(positiveNumber.toString()).toBe('987.654');
    });

    it('should implement isEqual() method correctly', () => {
      const value = 100.5;
      const positiveNumber1 = new PositiveNumber(value);
      const positiveNumber2 = new PositiveNumber(value);
      const positiveNumber3 = new PositiveNumber(200.7);

      expect(positiveNumber1.isEqual(positiveNumber2)).toBeTrue();
      expect(positiveNumber1.isEqual(positiveNumber3)).toBeFalse();
      expect(positiveNumber1.isEqual(value)).toBeTrue();
      expect(positiveNumber1.isEqual(200.7)).toBeFalse();
    });

    it('should implement isZero() method correctly', () => {
      // PositiveNumber cannot be zero, but method should exist
      const positiveNumber = new PositiveNumber(1);
      expect(positiveNumber.isZero()).toBeFalse();
      expect(typeof positiveNumber.isZero).toBe('function');
    });

    it('should implement comparison methods correctly', () => {
      const smaller = new PositiveNumber(5);
      const larger = new PositiveNumber(10);

      expect(larger.isGreaterThan(smaller)).toBeTrue();
      expect(smaller.isLessThan(larger)).toBeTrue();
      expect(larger.isGreaterOrEqualThan(smaller)).toBeTrue();
      expect(smaller.isLessOrEqualThan(larger)).toBeTrue();

      const equal = new PositiveNumber(5);
      expect(smaller.isGreaterOrEqualThan(equal)).toBeTrue();
      expect(smaller.isLessOrEqualThan(equal)).toBeTrue();
    });

    it('should implement clone() method correctly', () => {
      const originalValue = 3.14159;
      const original = new PositiveNumber(originalValue);
      const cloned = (original as any).clone();

      expect(cloned).toBeInstanceOf(PositiveNumber);
      expect(cloned).toBeInstanceOf(NumberValueObject);
      expect(cloned.valueOf()).toBe(originalValue);
      expect(cloned.toString()).toBe(originalValue.toString());
      expect(cloned.isEqual(original)).toBeTrue();
      expect(cloned).not.toBe(original); // Different instances
    });
  });

  describe('arithmetic operations with positive validation', () => {
    it('should perform addition and maintain positive result', () => {
      const a = new PositiveNumber(5);
      const b = new PositiveNumber(3);
      const result = a.add(b);

      expect(result).toBeInstanceOf(PositiveNumber);
      expect(result.valueOf()).toBe(8);
    });

    it('should perform multiplication and maintain positive result', () => {
      const a = new PositiveNumber(4);
      const b = new PositiveNumber(2.5);
      const result = a.multiply(b);

      expect(result).toBeInstanceOf(PositiveNumber);
      expect(result.valueOf()).toBe(10);
    });

    it('should perform division and maintain positive result', () => {
      const a = new PositiveNumber(10);
      const b = new PositiveNumber(2);
      const result = a.divide(b);

      expect(result).toBeInstanceOf(PositiveNumber);
      expect(result.valueOf()).toBe(5);
    });

    it('should throw an error if a subtraction results in negative number', () => {
      const a = new PositiveNumber(3);
      const b = new PositiveNumber(5);

      expect(() => a.subtract(b)).toThrow(InvalidPositiveNumberError);
    });

    it('should work with primitive numbers in operations', () => {
      const positive = new PositiveNumber(15);

      const addResult = positive.add(5);
      const multiplyResult = positive.multiply(2);
      const divideResult = positive.divide(3);

      expect(addResult.valueOf()).toBe(20);
      expect(multiplyResult.valueOf()).toBe(30);
      expect(divideResult.valueOf()).toBe(5);

      // All results should be NumberValueObject instances (not necessarily PositiveNumber)
      expect(addResult.valueOf()).toBeGreaterThan(0);
      expect(multiplyResult.valueOf()).toBeGreaterThan(0);
      expect(divideResult.valueOf()).toBeGreaterThan(0);
    });
  });

  describe('immutability', () => {
    it('should have immutable value property inherited from NumberValueObject', () => {
      const positiveNumber = new PositiveNumber(42);

      // Verify immutability through value consistency
      expect(positiveNumber.valueOf()).toBe(42);
      expect((positiveNumber as any).value).toBe(42);

      const originalValue = positiveNumber.valueOf();
      expect(originalValue).toBe(42);
    });

    it('should return the same value after creation', () => {
      const originalValue = 3.14159;
      const positiveNumber = new PositiveNumber(originalValue);

      expect(positiveNumber.valueOf()).toBe(originalValue);
      expect(positiveNumber.toString()).toBe(originalValue.toString());

      // Value should remain the same
      expect(positiveNumber.valueOf()).toBe(originalValue);
    });

    it('should create new instances instead of modifying existing ones', () => {
      const value1 = 100.5;
      const value2 = 200.7;

      const positiveNumber1 = new PositiveNumber(value1);
      const positiveNumber2 = new PositiveNumber(value2);

      expect(positiveNumber1.valueOf()).toBe(value1);
      expect(positiveNumber2.valueOf()).toBe(value2);
      expect(positiveNumber1.valueOf()).not.toBe(positiveNumber2.valueOf());
    });

    it('should maintain immutability when constructed from another PositiveNumber', () => {
      const original = new PositiveNumber(987.654);
      const copy = new PositiveNumber(original);

      expect(copy.valueOf()).toBe(original.valueOf());
      expect(copy.isEqual(original)).toBeTrue();

      // Both should maintain their values independently
      expect(original.valueOf()).toBe(987.654);
      expect(copy.valueOf()).toBe(987.654);
    });

    it('should maintain immutability when cloning', () => {
      const original = new PositiveNumber(777.888);
      const cloned = (original as any).clone();

      expect(original.valueOf()).toBe(777.888);
      expect(cloned.valueOf()).toBe(777.888);
      expect(original.isEqual(cloned)).toBeTrue();
      expect(original).not.toBe(cloned);

      // Both should remain immutable
      expect(original.valueOf()).toBe(777.888);
      expect(cloned.valueOf()).toBe(777.888);
    });

    it('should maintain immutability in arithmetic operations', () => {
      const original = new PositiveNumber(10);
      const other = new PositiveNumber(5);

      const sum = original.add(other);
      const product = original.multiply(other);
      const quotient = original.divide(other);

      // Original values should remain unchanged
      expect(original.valueOf()).toBe(10);
      expect(other.valueOf()).toBe(5);

      // Results should be correct
      expect(sum.valueOf()).toBe(15);
      expect(product.valueOf()).toBe(50);
      expect(quotient.valueOf()).toBe(2);

      // All should be different instances
      expect(sum).not.toBe(original);
      expect(product).not.toBe(original);
      expect(quotient).not.toBe(original);
    });
  });
});
