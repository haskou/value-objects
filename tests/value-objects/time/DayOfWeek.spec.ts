import { DayOfWeek, Timestamp, EDaysOfWeek } from '../../../src';

describe('DayOfWeek', () => {
  describe('fromNumber', () => {
    it('should create the correct Day instance from a number', () => {
      expect(
        DayOfWeek.fromNumber(new Timestamp('2024-05-27').getDayOfWeek()),
      ).toEqual(DayOfWeek.MONDAY);
      expect(
        DayOfWeek.fromNumber(new Timestamp('2024-05-28').getDayOfWeek()),
      ).toEqual(DayOfWeek.TUESDAY);
      expect(
        DayOfWeek.fromNumber(new Timestamp('2024-05-29').getDayOfWeek()),
      ).toEqual(DayOfWeek.WEDNESDAY);
      expect(
        DayOfWeek.fromNumber(new Timestamp('2024-05-30').getDayOfWeek()),
      ).toEqual(DayOfWeek.THURSDAY);
      expect(
        DayOfWeek.fromNumber(new Timestamp('2024-05-31').getDayOfWeek()),
      ).toEqual(DayOfWeek.FRIDAY);
      expect(
        DayOfWeek.fromNumber(new Timestamp('2024-06-01').getDayOfWeek()),
      ).toEqual(DayOfWeek.SATURDAY);
      expect(
        DayOfWeek.fromNumber(new Timestamp('2024-06-02').getDayOfWeek()),
      ).toEqual(DayOfWeek.SUNDAY);
    });

    it('should throw an error when an invalid number is provided', () => {
      expect(() => {
        DayOfWeek.fromNumber(23);
      }).toThrow();
    });
  });
  describe('toNumber', () => {
    it('should return the correct number for a day', () => {
      expect(DayOfWeek.MONDAY.toNumber()).toEqual(1);
      expect(DayOfWeek.TUESDAY.toNumber()).toEqual(2);
      expect(DayOfWeek.WEDNESDAY.toNumber()).toEqual(3);
      expect(DayOfWeek.THURSDAY.toNumber()).toEqual(4);
      expect(DayOfWeek.FRIDAY.toNumber()).toEqual(5);
      expect(DayOfWeek.SATURDAY.toNumber()).toEqual(6);
      expect(DayOfWeek.SUNDAY.toNumber()).toEqual(0);
    });
  });
  describe('fromTimestamp', () => {
    it('should create the correct Day instance from a timestamp', () => {
      expect(DayOfWeek.fromTimestamp(new Timestamp('2024-05-27'))).toEqual(
        DayOfWeek.MONDAY,
      );
      expect(DayOfWeek.fromTimestamp(new Timestamp('2024-05-28'))).toEqual(
        DayOfWeek.TUESDAY,
      );
      expect(DayOfWeek.fromTimestamp(new Timestamp('2024-05-29'))).toEqual(
        DayOfWeek.WEDNESDAY,
      );
      expect(DayOfWeek.fromTimestamp(new Timestamp('2024-05-30'))).toEqual(
        DayOfWeek.THURSDAY,
      );
      expect(DayOfWeek.fromTimestamp(new Timestamp('2024-05-31'))).toEqual(
        DayOfWeek.FRIDAY,
      );
      expect(DayOfWeek.fromTimestamp(new Timestamp('2024-06-01'))).toEqual(
        DayOfWeek.SATURDAY,
      );
      expect(DayOfWeek.fromTimestamp(new Timestamp('2024-06-02'))).toEqual(
        DayOfWeek.SUNDAY,
      );
    });
  });
});
