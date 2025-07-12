import {
  Timestamp,
  CalendarDay,
  InvalidDayError,
  Month,
  Day,
  DayOfWeek,
  Year,
  InvalidDayFormatError,
} from '../../../src';

/* eslint-disable @typescript-eslint/no-unsafe-call */
describe('CalendarDay', () => {
  describe('constructor', () => {
    it('should create a CalendarDay ', () => {
      const now = new Timestamp();
      const day = new CalendarDay();
      expect(day).toMatchObject({
        year: now.getYear().valueOf(),
        month: now.getMonth().valueOf(),
        day: now.getDay().valueOf(),
      });
    });

    it('should create a day instance with a valid date string', () => {
      const day = new CalendarDay('2022-01-01');
      expect(day).toMatchObject({
        year: 2022,
        month: 1,
        day: 1,
      });
    });

    it('should create a day instance with a valid Timestamp', () => {
      const day = new CalendarDay(new Timestamp('2022-01-01'));
      expect(day).toMatchObject({
        year: 2022,
        month: 1,
        day: 1,
      });
    });

    it('should create a day instance with a valid Date', () => {
      const day = new CalendarDay(new Date('2022-01-01'));
      expect(day).toMatchObject({
        year: 2022,
        month: 1,
        day: 1,
      });
    });

    it('should create a day instance with a valid number', () => {
      const day = new CalendarDay(1640995200000);
      expect(day).toMatchObject({
        year: 2022,
        month: 1,
        day: 1,
      });
    });

    it('should throw InvalidDateFormatError when provided with an invalid date string', () => {
      expect(() => new CalendarDay('2022-01-001')).toThrow(
        InvalidDayFormatError,
      );
    });

    it('should throw InvalidDateFormatError when provided with an invalid date string', () => {
      expect(() => new CalendarDay('2022-01')).toThrow(InvalidDayFormatError);
    });

    it('should throw InvalidDateFormatError when provided with an invalid date', () => {
      expect(() => new CalendarDay(new Date(NaN))).toThrow(InvalidDayError);
    });
  });

  describe('valueOf', () => {
    it('should return the date value as a string', () => {
      const day = new CalendarDay('2022-01-01');
      expect(day.valueOf()).toBe('2022-01-01');
    });
  });

  describe('isEqual', () => {
    it('should return true when two days have the same value', () => {
      const day1 = new CalendarDay('2022-01-01');
      const day2 = new CalendarDay('2022-01-01');
      expect(day1.isEqual(day2)).toBe(true);
    });

    it('should return false when two days have different values', () => {
      const day1 = new CalendarDay('2022-01-01');
      const day2 = new CalendarDay('2022-01-02');
      expect(day1.isEqual(day2)).toBe(false);
    });
  });

  describe('isAfter', () => {
    it('should return true when the current day is after the provided day', () => {
      const day1 = new CalendarDay('2022-01-02');
      const day2 = new CalendarDay('2022-01-01');
      expect(day1.isAfter(day2)).toBe(true);
    });

    it('should return false when the current day is not after the provided day', () => {
      const day1 = new CalendarDay('2022-01-01');
      const day2 = new CalendarDay('2022-01-02');
      expect(day1.isAfter(day2)).toBe(false);
    });
  });

  describe('isBefore', () => {
    it('should return true when the current day is before the provided day', () => {
      const day1 = new CalendarDay('2022-01-01');
      const day2 = new CalendarDay('2022-01-02');
      expect(day1.isBefore(day2)).toBe(true);
    });

    it('should return false when the current day is not before the provided day', () => {
      const day1 = new CalendarDay('2022-01-02');
      const day2 = new CalendarDay('2022-01-01');
      expect(day1.isBefore(day2)).toBe(false);
    });
  });
  describe('getYear', () => {
    it('should return the year of the day', () => {
      const day = new CalendarDay('2022-01-02');
      expect(day.getYear()).toBe(2022);
    });
  });
  describe('getMonth', () => {
    it('should return the Month of the day', () => {
      const day = new CalendarDay('2022-01-02');
      expect(day.getMonth()).toStrictEqual(Month.JANUARY);
    });
  });
  describe('getDay', () => {
    it('should return the year of the day', () => {
      const day = new CalendarDay('2022-01-02');
      expect(day.getDay()).toStrictEqual(new Day(2));
    });
  });
  describe('getDayOfWeek', () => {
    it('should return the correct DayOfWeek for a given date', () => {
      expect(new CalendarDay('2025-01-05').getDayOfWeek()).toEqual(
        DayOfWeek.SUNDAY,
      );
      expect(new CalendarDay('2025-01-31').getDayOfWeek()).toEqual(
        DayOfWeek.FRIDAY,
      );
      expect(new CalendarDay('2025-02-28').getDayOfWeek()).toEqual(
        DayOfWeek.FRIDAY,
      );
      expect(new CalendarDay('2024-12-31').getDayOfWeek()).toEqual(
        DayOfWeek.TUESDAY,
      );
    });

    describe('toTimestamp', () => {
      it('should return the correct Timestamp instance', () => {
        const timestamp = new Timestamp('2022-01-01');
        const day = new CalendarDay(timestamp);
        expect(day.toTimestamp()).toStrictEqual(timestamp);
      });

      it('should return a Timestamp instance matching the date value', () => {
        const day = new CalendarDay('2022-01-01');
        const timestamp = day.toTimestamp();
        expect(timestamp.valueOf()).toBe(new Timestamp('2022-01-01').valueOf());
      });
    });
    describe('getMonthOfYear', () => {
      it('should return a MonthOfYear instance with the correct month and year', () => {
        const day = new CalendarDay('2022-01-02');
        const month = day.getMonthOfYear();
        expect(month).toMatchObject({
          month: Month.JANUARY,
          year: new Year(2022),
        });
      });
    });
  });
});
