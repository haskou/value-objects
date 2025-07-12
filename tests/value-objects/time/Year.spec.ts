import { NullObject, Year } from '../../../src';

describe('Year', () => {
  describe('constructor', () => {
    it('should return a NullValueObject when a Nullish is received', () => {
      expect(() => new Year(undefined as unknown as number)).not.toThrow();
      expect(
        NullObject.isNullObject(new Year(undefined as unknown as number)),
      ).toBeTrue();
      expect(
        NullObject.isNullObject(new Year(null as unknown as number)),
      ).toBeTrue();
    });
  });
  describe('isLeapYear', () => {
    it('should return true for a leap year divisible by 4 but not by 100', () => {
      const year = new Year(2024);
      expect(year.isLeapYear()).toBe(true);
    });

    it('should return false for a non-leap year not divisible by 4', () => {
      const year = new Year(2023);
      expect(year.isLeapYear()).toBe(false);
    });

    it('should return false for a year divisible by 100 but not by 400', () => {
      const year = new Year(1900);
      expect(year.isLeapYear()).toBe(false);
    });

    it('should return true for a year divisible by 400', () => {
      const year = new Year(2000);
      expect(year.isLeapYear()).toBe(true);
    });
  });

  describe('getNumberOfDays', () => {
    it('should return 366 for a leap year', () => {
      const year = new Year(2024);
      expect(year.getNumberOfDays()).toBe(366);
    });

    it('should return 365 for a non-leap year', () => {
      const year = new Year(2023);
      expect(year.getNumberOfDays()).toBe(365);
    });
  });
});
