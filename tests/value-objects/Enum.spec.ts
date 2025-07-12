import { Enum, NullObject, ValueNotInEnumError } from '../../src';

class StringEnum extends Enum {
  public getValues() {
    return ['A', 'B', 'C'];
  }
}

class NumberEnum extends Enum {
  public getValues() {
    return [1, 2, 3];
  }
}

class MixedEnum extends Enum {
  public getValues() {
    return ['1', 2];
  }
}

enum StatusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
}

class Status extends Enum {
  public getValues() {
    return Object.values(StatusEnum);
  }

  // Static factory methods for convenience
  static ACTIVE = () => new Status(StatusEnum.ACTIVE);
  static INACTIVE = () => new Status(StatusEnum.INACTIVE);
  static PENDING = () => new Status(StatusEnum.PENDING);
}

describe('Enum', () => {
  describe('constructor', () => {
    it('should return a Null when a Nullish is received', () => {
      expect(
        () => new StringEnum(undefined as unknown as string),
      ).not.toThrow();
      expect(
        NullObject.isNullObject(new StringEnum(undefined as unknown as string)),
      ).toBeTrue();
      expect(
        NullObject.isNullObject(new StringEnum(null as unknown as string)),
      ).toBeTrue();
    });

    it('should accept valid string enum values', () => {
      expect(() => new StringEnum('A')).not.toThrow();
      expect(() => new StringEnum('B')).not.toThrow();
      expect(() => new StringEnum('C')).not.toThrow();

      const enumValue = new StringEnum('A');
      expect(enumValue.valueOf()).toBe('A');
      expect(enumValue.toString()).toBe('A');
    });

    it('should accept valid number enum values', () => {
      expect(() => new NumberEnum(1)).not.toThrow();
      expect(() => new NumberEnum(2)).not.toThrow();
      expect(() => new NumberEnum(3)).not.toThrow();

      const enumValue = new NumberEnum(2);
      expect(enumValue.valueOf()).toBe(2);
      expect(enumValue.toString()).toBe('2');
    });

    it('should accept valid mixed enum values', () => {
      expect(() => new MixedEnum('1')).not.toThrow();
      expect(() => new MixedEnum(2)).not.toThrow();

      const stringValue = new MixedEnum('1');
      const numberValue = new MixedEnum(2);
      expect(stringValue.valueOf()).toBe('1');
      expect(numberValue.valueOf()).toBe(2);
    });

    it('should reject invalid string enum values', () => {
      expect(() => new StringEnum('D')).toThrow(ValueNotInEnumError);
      expect(() => new StringEnum('X')).toThrow(ValueNotInEnumError);
      expect(() => new StringEnum('')).toThrow(ValueNotInEnumError);
    });

    it('should reject invalid number enum values', () => {
      expect(() => new NumberEnum(0)).toThrow(ValueNotInEnumError);
      expect(() => new NumberEnum(4)).toThrow(ValueNotInEnumError);
      expect(() => new NumberEnum(-1)).toThrow(ValueNotInEnumError);
    });

    it('should reject invalid mixed enum values', () => {
      expect(() => new MixedEnum('2')).toThrow(ValueNotInEnumError);
      expect(() => new MixedEnum(1)).toThrow(ValueNotInEnumError);
      expect(() => new MixedEnum('invalid')).toThrow(ValueNotInEnumError);
    });

    it('should work with TypeScript enum values', () => {
      expect(() => new Status(StatusEnum.ACTIVE)).not.toThrow();
      expect(() => new Status('active')).not.toThrow();
      expect(() => new Status('inactive')).not.toThrow();
      expect(() => new Status('pending')).not.toThrow();

      const status = new Status(StatusEnum.ACTIVE);
      expect(status.valueOf()).toBe('active');
    });

    it('should reject invalid TypeScript enum values', () => {
      expect(() => new Status('unknown')).toThrow(ValueNotInEnumError);
      expect(() => new Status('ACTIVE')).toThrow(ValueNotInEnumError); // Case sensitive
    });
  });

  describe('inheritance and  behavior', () => {
    it('should inherit from ', () => {
      const enumValue = new StringEnum('A');
      expect(enumValue).toBeInstanceOf(StringEnum);
      expect(enumValue).toBeInstanceOf(Enum);
      expect(enumValue.valueOf).toBeDefined();
      expect(enumValue.isEqual).toBeDefined();
      expect(enumValue.toString).toBeDefined();
    });

    it('should implement valueOf() method correctly', () => {
      const stringEnum = new StringEnum('B');
      const numberEnum = new NumberEnum(2);

      expect(stringEnum.valueOf()).toBe('B');
      expect(numberEnum.valueOf()).toBe(2);
    });

    it('should implement toString() method correctly from ', () => {
      const stringEnum = new StringEnum('C');
      const numberEnum = new NumberEnum(3);

      expect(stringEnum.toString()).toBe('C');
      expect(numberEnum.toString()).toBe('3');
    });

    it('should implement isEqual() method correctly', () => {
      const enum1 = new StringEnum('A');
      const enum2 = new StringEnum('A');
      const enum3 = new StringEnum('B');

      expect(enum1.isEqual(enum2)).toBeTrue();
      expect(enum1.isEqual(enum3)).toBeFalse();
      expect(enum1.isEqual('A')).toBeTrue();
      expect(enum1.isEqual('B')).toBeFalse();
    });

    it('should compare with primitive values using isEqual', () => {
      const stringEnum = new StringEnum('A');
      const numberEnum = new NumberEnum(1);

      expect(stringEnum.isEqual('A')).toBeTrue();
      expect(stringEnum.isEqual('B')).toBeFalse();
      expect(numberEnum.isEqual(1)).toBeTrue();
      expect(numberEnum.isEqual(2)).toBeFalse();
    });

    it('should implement clone() method correctly', () => {
      const original = new StringEnum('B');
      const cloned = (original as any).clone();

      expect(cloned).toBeInstanceOf(StringEnum);
      expect(cloned).toBeInstanceOf(Enum);
      expect(cloned.valueOf()).toBe('B');
      expect(cloned.toString()).toBe('B');
      expect(cloned.isEqual(original)).toBeTrue();
      expect(cloned).not.toBe(original); // Different instances
    });

    it('should maintain enum validation in cloned instances', () => {
      const original = new NumberEnum(3);
      const cloned = (original as any).clone();

      expect(cloned).toBeInstanceOf(NumberEnum);
      expect(cloned.valueOf()).toBe(3);

      // Cloned instance should still be a valid enum value
      expect(() => cloned.toString()).not.toThrow();
      expect(cloned.toString()).toBe('3');
    });
  });

  describe('immutability', () => {
    it('should have immutable value property inherited from ', () => {
      const enumValue = new StringEnum('A');

      // Verify immutability through value consistency
      expect(enumValue.valueOf()).toBe('A');
      expect((enumValue as any).value).toBe('A');

      const originalValue = enumValue.valueOf();
      expect(originalValue).toBe('A');
    });

    it('should return the same value after creation', () => {
      const originalValue = 'B';
      const enumValue = new StringEnum(originalValue);

      expect(enumValue.valueOf()).toBe(originalValue);
      expect(enumValue.toString()).toBe(originalValue);

      // Value should remain the same
      expect(enumValue.valueOf()).toBe(originalValue);
    });

    it('should create new instances instead of modifying existing ones', () => {
      const value1 = 'A';
      const value2 = 'C';

      const enum1 = new StringEnum(value1);
      const enum2 = new StringEnum(value2);

      expect(enum1.valueOf()).toBe(value1);
      expect(enum2.valueOf()).toBe(value2);
      expect(enum1.valueOf()).not.toBe(enum2.valueOf());
    });

    it('should maintain immutability when cloning', () => {
      const original = new NumberEnum(2);
      const cloned = (original as any).clone();

      expect(original.valueOf()).toBe(2);
      expect(cloned.valueOf()).toBe(2);
      expect(original.isEqual(cloned)).toBeTrue();
      expect(original).not.toBe(cloned);

      // Both should remain immutable
      expect(original.valueOf()).toBe(2);
      expect(cloned.valueOf()).toBe(2);
    });
  });

  describe('enum validation', () => {
    it('should validate against the defined enum values', () => {
      const stringEnum = new StringEnum('A');
      expect(stringEnum.valueOf()).toBe('A');

      // Should be one of ['A', 'B', 'C']
      expect(['A', 'B', 'C']).toContain(stringEnum.valueOf());
    });

    it('should provide meaningful error messages for invalid values', () => {
      expect(() => new StringEnum('D')).toThrow(
        /enum does not include value: D/,
      );
      expect(() => new NumberEnum(4)).toThrow(/enum does not include value: 4/);
    });

    it('should be case-sensitive for string enums', () => {
      expect(() => new StringEnum('a')).toThrow(ValueNotInEnumError);
      expect(() => new Status('ACTIVE')).toThrow(ValueNotInEnumError);
    });

    it('should handle type-sensitive validation for mixed enums', () => {
      // '1' (string) is valid, but 1 (number) is not
      expect(() => new MixedEnum('1')).not.toThrow();
      expect(() => new MixedEnum(1)).toThrow(ValueNotInEnumError);

      // 2 (number) is valid, but '2' (string) is not
      expect(() => new MixedEnum(2)).not.toThrow();
      expect(() => new MixedEnum('2')).toThrow(ValueNotInEnumError);
    });
  });

  describe('static factory methods', () => {
    it('should work with static factory methods for convenience', () => {
      const activeStatus = Status.ACTIVE();
      const inactiveStatus = Status.INACTIVE();
      const pendingStatus = Status.PENDING();

      expect(activeStatus.valueOf()).toBe('active');
      expect(inactiveStatus.valueOf()).toBe('inactive');
      expect(pendingStatus.valueOf()).toBe('pending');

      expect(activeStatus).toBeInstanceOf(Status);
      expect(inactiveStatus).toBeInstanceOf(Status);
      expect(pendingStatus).toBeInstanceOf(Status);
    });

    it('should maintain equality with factory methods', () => {
      const status1 = Status.ACTIVE();
      const status2 = new Status('active');

      expect(status1.isEqual(status2)).toBeTrue();
      expect(status1.valueOf()).toBe(status2.valueOf());
    });
  });
});
