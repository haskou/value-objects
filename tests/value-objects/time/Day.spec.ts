import { Day, InvalidDayError, NumberValueObject } from '../../../src';

describe('Day', () => {
  it('should create a valid Day instance for a value within the valid range', () => {
    expect(() => new Day(1)).not.toThrow();
    expect(() => new Day(15)).not.toThrow();
    expect(() => new Day(31)).not.toThrow();
  });

  it('should throw InvalidDayError for a value less than 1', () => {
    expect(() => new Day(0)).toThrow(InvalidDayError);
    expect(() => new Day(-1)).toThrow(InvalidDayError);
  });

  it('should throw InvalidDayError for a value greater than 31', () => {
    expect(() => new Day(32)).toThrow(InvalidDayError);
    expect(() => new Day(100)).toThrow(InvalidDayError);
  });

  it('should accept a NumberValueObject as input', () => {
    expect(() => new Day(new NumberValueObject(3))).not.toThrow();
  });
  it('should be not equal to another Day with a different value', () => {
    const day1 = new Day(1);
    const day2 = new Day(2);
    expect(day1.isEqual(day2)).toBe(false);
    expect(day1.isNotEqual(day2)).toBe(true);
  });
});
