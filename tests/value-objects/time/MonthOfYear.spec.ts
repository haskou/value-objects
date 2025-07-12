import {
  MonthOfYear,
  Month,
  Year,
  ValueNotInEnumError,
  InvalidIntegerError,
} from '../../../src';

describe('MonthOfYear', () => {
  describe('constructor', () => {
    it('should create a Month instance', () => {
      const month = new MonthOfYear(1, 2022);
      expect(month).toMatchObject({
        month: Month.JANUARY,
        year: new Year(2022),
      });
    });
    it('should throw error if the Month is negative', () => {
      expect(() => new MonthOfYear(-1, 2022)).toThrow(ValueNotInEnumError);
    });
    it('should throw error if the Month is not integer', () => {
      expect(() => new MonthOfYear(1.1, 2022)).toThrow(ValueNotInEnumError);
    });
    it('should throw error if the Month is greater than 12', () => {
      expect(() => new MonthOfYear(13, 2022)).toThrow(ValueNotInEnumError);
    });
    it('should throw error if the Year is not integer', () => {
      expect(() => new MonthOfYear(1, 2022.1)).toThrow(InvalidIntegerError);
    });
  });

  describe('getYear', () => {
    it('should return the year', () => {
      const month = new MonthOfYear(1, 2022);
      expect(month.getYear()).toStrictEqual(new Year(2022));
    });
  });

  describe('getDays', () => {
    it('should return the number of days in the month', () => {
      const month = new MonthOfYear(1, 2022);
      expect(month.getNumberOfDays()).toBe(31);
    });
    it('should return the correct number of days for February', () => {
      const month = new MonthOfYear(2, 2022);
      expect(month.getNumberOfDays()).toBe(28);
    });
  });

  describe('getTimestampInterval', () => {
    it('should return the timestamp interval for the month', () => {
      const month = new MonthOfYear(1, 2022);
      const interval = month.getTimestampInterval();
      expect(interval.getStart().valueOf()).toBe(1640995200000);
      expect(interval.getEnd().valueOf()).toBe(1643587200000);
    });
  });
  describe('getMonth', () => {
    it('should return a Month instance with the correct month value', () => {
      const monthOfYear = new MonthOfYear(5, 2022);
      const month = monthOfYear.getMonth();
      expect(month).toStrictEqual(Month.MAY);
    });
  });
  describe('fromTimestamp', () => {
    it('should create a MonthOfYear instance from a valid Timestamp', () => {
      const timestamp = { getMonth: () => 5, getYear: () => 2022 } as any;
      const monthOfYear = MonthOfYear.fromTimestamp(timestamp);
      expect(monthOfYear.getMonth().valueOf()).toBe(5);
      expect(monthOfYear.getYear()).toStrictEqual(new Year(2022));
    });

    it('should throw an error if the Timestamp has an invalid month', () => {
      const timestamp = { getMonth: () => 13, getYear: () => 2022 } as any;
      expect(() => MonthOfYear.fromTimestamp(timestamp)).toThrow(
        ValueNotInEnumError,
      );
    });
  });
  describe('fromString', () => {
    it('should create a MonthOfYear instance from a valid string', () => {
      const monthOfYear = MonthOfYear.fromString('2022/05');
      expect(monthOfYear.getMonth().valueOf()).toBe(5);
      expect(monthOfYear.getYear()).toStrictEqual(new Year(2022));
    });

    it('should pad single digit months correctly', () => {
      const monthOfYear = MonthOfYear.fromString('2022/1');
      expect(monthOfYear.getMonth().valueOf()).toBe(1);
      expect(monthOfYear.getYear()).toStrictEqual(new Year(2022));
    });

    it('should throw error for invalid month', () => {
      expect(() => MonthOfYear.fromString('2022/13')).toThrow(
        ValueNotInEnumError,
      );
    });

    it('should throw error for invalid year', () => {
      expect(() => MonthOfYear.fromString('2022.1/05')).toThrow(
        InvalidIntegerError,
      );
    });

    it('should throw error for malformed string', () => {
      expect(() => MonthOfYear.fromString('2022')).toThrow();
      expect(() => MonthOfYear.fromString('')).toThrow();
      expect(() => MonthOfYear.fromString('2022/')).toThrow();
    });
  });
});
