import {
  Timestamp,
  Year,
  Month,
  Day,
  Duration,
  CalendarDay,
  MonthOfYear,
} from '../../../src';

describe('Timestamp', () => {
  describe('constructor', () => {
    it('should create a Timestamp with a Date value', () => {
      expect(new Timestamp(new Date())).toBeInstanceOf(Timestamp);
    });

    it('should create a Timestamp with a number value', () => {
      expect(new Timestamp(1666094980)).toBeInstanceOf(Timestamp);
    });

    it('should create a Timestamp with Timestamp value', () => {
      expect(new Timestamp(new Timestamp(1666094980))).toBeInstanceOf(
        Timestamp,
      );
    });

    it('should create a Timestamp with string value', () => {
      expect(new Timestamp('2020-01-01')).toBeInstanceOf(Timestamp);
    });

    it('should create a Timestamp with a empty value', () => {
      expect(new Timestamp()).toBeInstanceOf(Timestamp);
    });
  });

  describe('static new', () => {
    it('should create a Timestamp with a Date value', () => {
      expect(Timestamp.new(1666094980)).toBeInstanceOf(Timestamp);
    });

    it('should create a Timestamp with a number value', () => {
      expect(Timestamp.new(new Date())).toBeInstanceOf(Timestamp);
    });

    it('should create a Timestamp with Timestamp value', () => {
      expect(Timestamp.new(new Timestamp())).toBeInstanceOf(Timestamp);
    });
  });

  describe('static now', () => {
    it('should create a Timestamp with a Date value', () => {
      expect(Timestamp.now()).toBeInstanceOf(Timestamp);
    });
  });

  describe('fromSeconds', () => {
    it('should create a Timestamp with a Date value', () => {
      expect(Timestamp.fromSeconds(1666094)).toBeInstanceOf(Timestamp);
    });
  });

  describe('toExactHour', () => {
    it('should convert a non-exact hour date to have exact hour', () => {
      const timestamp = new Timestamp('2024-05-06T09:35:53.205Z');
      const newTimestamp = timestamp.toExactHour();

      expect(newTimestamp.getYear()).toEqual(new Year(2024));
      expect(newTimestamp.getMonth()).toEqual(Month.MAY);
      expect(newTimestamp.getDay()).toEqual(new Day(6));
      expect(newTimestamp.getHours()).toEqual(9);
      expect(newTimestamp.getMinutes()).toEqual(0);
      expect(newTimestamp.getSeconds()).toEqual(0);
      expect(newTimestamp.getMilliseconds()).toEqual(0);
    });

    it('should convert a non-exact hour date to have exact hour with return value', () => {
      const timestamp = new Timestamp('2024-05-06T09:35:53.205Z');
      const resultTimestamp = timestamp.toExactHour();

      expect(resultTimestamp.getYear()).toEqual(new Year(2024));
      expect(resultTimestamp.getMonth()).toEqual(Month.MAY);
      expect(resultTimestamp.getDay()).toEqual(new Day(6));
      expect(resultTimestamp.getHours()).toEqual(9);
      expect(resultTimestamp.getMinutes()).toEqual(0);
      expect(resultTimestamp.getSeconds()).toEqual(0);
      expect(resultTimestamp.getMilliseconds()).toEqual(0);
    });
  });

  describe('toMilliseconds', () => {
    it('should return a number', () => {
      expect(Timestamp.now().toMilliseconds()).toBeNumber();
    });
  });

  describe('toSeconds', () => {
    it('should return a number', () => {
      expect(Timestamp.now().toSeconds()).toBeNumber();
    });
  });

  describe('toDate', () => {
    it('should return a Date', () => {
      expect(Timestamp.now().toDate()).toBeInstanceOf(Date);
    });
  });

  describe('toString', () => {
    it('should return a string', () => {
      const timestamp = Timestamp.now();
      expect(timestamp.toString()).toEqual(`${timestamp.valueOf()}`);
    });
  });

  describe('valueOf', () => {
    it('should return a number', () => {
      expect(Timestamp.now().valueOf()).toBeNumber();
    });
  });

  describe('isEqual', () => {
    it('should return true when value is equal to  other', () => {
      const now = Timestamp.now();
      expect(now.isEqual(new Timestamp(now.valueOf()))).toBeTrue();
    });
  });

  describe('isBefore', () => {
    it('should return true when value is before other', () => {
      expect(Timestamp.now().isBefore(Timestamp.now().addDays(1))).toBeTrue();
    });
  });

  describe('isAfter', () => {
    it('should return true when value is after other', () => {
      expect(Timestamp.now().isAfter(Timestamp.now())).toBeFalse();
    });
  });

  describe('isBeforeOrEqual', () => {
    it('should return true when value is before or equal to other', () => {
      const tomorrow = Timestamp.now().addDays(1);
      expect(Timestamp.now().isBeforeOrEqual(tomorrow)).toBeTrue();
    });
  });

  describe('isAfterOrEqual', () => {
    it('should return true when value is after or equal to other', () => {
      const yesterday = Timestamp.now().addDays(-1);
      expect(Timestamp.now().isAfterOrEqual(yesterday)).toBeTrue();
    });
  });

  describe('addMilliseconds', () => {
    it('should add Milliseconds', () => {
      const timestamp = Timestamp.now();
      const copy = Timestamp.new(timestamp);
      expect(timestamp.addMilliseconds(1)).toStrictEqual(
        new Timestamp(copy.valueOf() + 1),
      );
    });
  });

  describe('addSeconds', () => {
    it('should add seconds', () => {
      const timestamp = Timestamp.now();
      const copy = Timestamp.new(timestamp);
      expect(timestamp.addSeconds(1).isAfter(copy)).toBeTrue();
    });
  });

  describe('addMinutes', () => {
    it('should add minutes', () => {
      const timestamp = Timestamp.now();
      const copy = Timestamp.new(timestamp);
      expect(timestamp.addMinutes(1).isAfter(copy)).toBeTrue();
    });
  });

  describe('addHours', () => {
    it('should add hours', () => {
      const timestamp = Timestamp.now();
      const copy = Timestamp.new(timestamp);
      expect(timestamp.addHours(1).isAfter(copy)).toBeTrue();
    });
  });

  describe('addDays', () => {
    it('should add days', () => {
      const timestamp = Timestamp.now();
      const copy = Timestamp.new(timestamp);
      expect(timestamp.addDays(1).isAfter(copy)).toBeTrue();
    });
  });

  describe('addWeeks', () => {
    it('should add weeks', () => {
      const timestamp = Timestamp.now();
      const copy = Timestamp.new(timestamp);
      expect(timestamp.addWeeks(1).isAfter(copy)).toBeTrue();
    });
  });

  describe('addMonths', () => {
    it('should add months', () => {
      const timestamp = Timestamp.now();
      const copy = Timestamp.new(timestamp);
      expect(timestamp.addMonths(1).isAfter(copy)).toBeTrue();
    });
  });

  describe('addYears', () => {
    it('should add years', () => {
      const timestamp = Timestamp.now();
      const copy = Timestamp.new(timestamp);
      expect(timestamp.addYears(1).isAfter(copy)).toBeTrue();
    });
  });

  describe('getDay', () => {
    it('should return a value object', () => {
      expect(Timestamp.now().getDay()).toBeObject();
    });
    it('should return a number in the correct timezone', () => {
      expect(
        Timestamp.new(new Date('Sun Dec 31 2023 23:04:36 GMT-0100')).getDay(),
      ).toStrictEqual(new Day(1));
    });
  });

  describe('getMonth', () => {
    it('should return a Month', () => {
      expect(new Timestamp('2025-01-01').getMonth()).toStrictEqual(
        Month.JANUARY,
      );
    });
    it('should return a number in the correct timezone', () => {
      expect(
        Timestamp.new(new Date('Sun Dec 31 2023 23:04:36 GMT-0100')).getDay(),
      ).toStrictEqual(new Day(1));
    });
  });

  describe('getYear', () => {
    it('should return a Year', () => {
      expect(new Timestamp('2025-01-01').getYear()).toStrictEqual(
        new Year(2025),
      );
    });
    it('should return a Year in the correct timezone', () => {
      expect(
        Timestamp.new(new Date('Sun Dec 31 2023 23:04:36 GMT-0100')).getYear(),
      ).toStrictEqual(new Year(2024));
    });
  });

  describe('getHours', () => {
    it('should return a number', () => {
      expect(Timestamp.now().getHours()).toBeNumber();
    });
    it('should return a number in the correct timezone', () => {
      expect(
        Timestamp.new(new Date('Sun Dec 31 2023 23:04:36 GMT-0100')).getHours(),
      ).toBe(0);
    });
  });

  describe('getMinutes', () => {
    it('should return a number', () => {
      expect(Timestamp.now().getMinutes()).toBeNumber();
    });
    it('should return a number in the correct timezone', () => {
      expect(
        Timestamp.new(
          new Date('Sun Dec 31 2023 23:04:36 GMT-0100'),
        ).getMinutes(),
      ).toBe(4);
    });
  });

  describe('getSeconds', () => {
    it('should return a number', () => {
      expect(Timestamp.now().getSeconds()).toBeNumber();
    });
    it('should return a number in the correct timezone', () => {
      expect(
        Timestamp.new(
          new Date('Sun Dec 31 2023 23:04:36 GMT-0100'),
        ).getSeconds(),
      ).toBe(36);
    });
  });

  describe('getMilliseconds', () => {
    it('should return a number', () => {
      expect(Timestamp.now().getMilliseconds()).toBeNumber();
    });
  });

  describe('getDayOfWeek', () => {
    it('should return a number', () => {
      expect(Timestamp.now().getDayOfWeek()).toBeNumber();
    });
    it('should return a number in the correct timezone', () => {
      expect(
        Timestamp.new(
          new Date('Sun Dec 31 2023 23:04:36 GMT-0100'),
        ).getDayOfWeek(),
      ).toBe(1);
    });
  });

  describe('isSameDay', () => {
    it('should return true for Timestamps on the same day', () => {
      const timestamp1 = new Timestamp('2024-05-06T09:35:53.205Z');
      const timestamp2 = new Timestamp('2024-05-06T23:59:59.999Z');
      expect(timestamp1.isSameDay(timestamp2)).toBeTrue();
    });

    it('should return false for Timestamps on different days', () => {
      const timestamp1 = new Timestamp('2024-05-06T09:35:53.205Z');
      const timestamp2 = new Timestamp('2024-05-07T00:00:00.000Z');
      expect(timestamp1.isSameDay(timestamp2)).toBeFalse();
    });

    it('should return true for Timestamps on the same day in different timezones', () => {
      const timestamp1 = new Timestamp('2024-05-06T23:59:59.999Z');
      const timestamp2 = new Timestamp('2024-05-06T00:00:00.000Z');
      expect(timestamp1.isSameDay(timestamp2)).toBeTrue();
    });

    it('should return false for Timestamps on the same day but different months', () => {
      const timestamp1 = new Timestamp('2024-05-06T09:35:53.205Z');
      const timestamp2 = new Timestamp('2024-06-06T09:35:53.205Z');
      expect(timestamp1.isSameDay(timestamp2)).toBeFalse();
    });

    it('should return false for Timestamps on the same day but different years', () => {
      const timestamp1 = new Timestamp('2024-05-06T09:35:53.205Z');
      const timestamp2 = new Timestamp('2025-05-06T09:35:53.205Z');
      expect(timestamp1.isSameDay(timestamp2)).toBeFalse();
    });
  });
  describe('addDuration', () => {
    it('should add a duration to the timestamp', () => {
      const timestamp = new Timestamp('2024-05-06T09:35:53.205Z');
      const duration = Duration.fromMinutes(1);
      const newTimestamp = timestamp.addDuration(duration);

      expect(newTimestamp).toEqual(
        new Timestamp(
          timestamp.valueOf() + duration.getTotalMilliseconds().valueOf(),
        ),
      );
    });

    it('should return a new Timestamp instance', () => {
      const timestamp = new Timestamp('2024-05-06T09:35:53.205Z');
      const duration = Duration.fromMinutes(1);
      const newTimestamp = timestamp.addDuration(duration);

      expect(newTimestamp).toBeInstanceOf(Timestamp);
      expect(newTimestamp).not.toBe(timestamp);
    });

    it('should handle a duration of 0 milliseconds', () => {
      const timestamp = new Timestamp('2024-05-06T09:35:53.205Z');
      const duration = Duration.fromHours(0);
      const newTimestamp = timestamp.addDuration(duration);

      expect(newTimestamp.toMilliseconds()).toEqual(timestamp.toMilliseconds());
    });

    it('should handle a negative duration', () => {
      const timestamp = new Timestamp('2024-05-06T09:35:53.205Z');
      const duration = Duration.fromMinutes(-1);
      const newTimestamp = timestamp.addDuration(duration);

      expect(newTimestamp.toMilliseconds()).toEqual(
        timestamp.toMilliseconds() - 60000,
      );
    });
  });
  describe('isSameMonth', () => {
    it('should return true for Timestamps in the same month and year', () => {
      const timestamp1 = new Timestamp('2024-05-06T09:35:53.205Z');
      const timestamp2 = new Timestamp('2024-05-31T23:59:59.999Z');
      expect(timestamp1.isSameMonth(timestamp2)).toBeTrue();
    });

    it('should return false for Timestamps in the same month but different years', () => {
      const timestamp1 = new Timestamp('2024-05-06T09:35:53.205Z');
      const timestamp2 = new Timestamp('2025-05-06T09:35:53.205Z');
      expect(timestamp1.isSameMonth(timestamp2)).toBeFalse();
    });

    it('should return false for Timestamps in different months of the same year', () => {
      const timestamp1 = new Timestamp('2024-05-06T09:35:53.205Z');
      const timestamp2 = new Timestamp('2024-06-06T09:35:53.205Z');
      expect(timestamp1.isSameMonth(timestamp2)).toBeFalse();
    });

    it('should return false for Timestamps in different months and years', () => {
      const timestamp1 = new Timestamp('2024-05-06T09:35:53.205Z');
      const timestamp2 = new Timestamp('2025-06-06T09:35:53.205Z');
      expect(timestamp1.isSameMonth(timestamp2)).toBeFalse();
    });

    it('should return true for Timestamps in the same month regardless of time', () => {
      const timestamp1 = new Timestamp('2024-05-01T00:00:00.000Z');
      const timestamp2 = new Timestamp('2024-05-31T23:59:59.999Z');
      expect(timestamp1.isSameMonth(timestamp2)).toBeTrue();
    });
  });
  describe('isSameYear', () => {
    it('should return true for Timestamps in the same year', () => {
      const timestamp1 = new Timestamp('2024-05-06T09:35:53.205Z');
      const timestamp2 = new Timestamp('2024-12-31T23:59:59.999Z');
      expect(timestamp1.isSameYear(timestamp2)).toBeTrue();
    });

    it('should return false for Timestamps in different years', () => {
      const timestamp1 = new Timestamp('2024-05-06T09:35:53.205Z');
      const timestamp2 = new Timestamp('2025-05-06T09:35:53.205Z');
      expect(timestamp1.isSameYear(timestamp2)).toBeFalse();
    });

    it('should return true for Timestamps in the same year regardless of month or day', () => {
      const timestamp1 = new Timestamp('2024-01-01T00:00:00.000Z');
      const timestamp2 = new Timestamp('2024-12-31T23:59:59.999Z');
      expect(timestamp1.isSameYear(timestamp2)).toBeTrue();
    });

    it('should return false for Timestamps in the same month but different years', () => {
      const timestamp1 = new Timestamp('2024-05-06T09:35:53.205Z');
      const timestamp2 = new Timestamp('2025-05-06T09:35:53.205Z');
      expect(timestamp1.isSameYear(timestamp2)).toBeFalse();
    });

    it('should return true for Timestamps in the same year with different timezones', () => {
      const timestamp1 = new Timestamp('2024-05-06T23:59:59.999Z');
      const timestamp2 = new Timestamp('2024-05-06T00:00:00.000Z');
      expect(timestamp1.isSameYear(timestamp2)).toBeTrue();
    });
  });
  describe('getCalendarDay', () => {
    it('should return a CalendarDay instance', () => {
      const today = new CalendarDay();
      const timestamp = Timestamp.now();
      const calendarDay = timestamp.getCalendarDay();
      expect(calendarDay).toStrictEqual(today);
    });

    it('should return a CalendarDay with the correct date', () => {
      const timestamp = new Timestamp('2024-05-06T09:35:53.205Z');
      const calendarDay = timestamp.getCalendarDay();
      expect(calendarDay).toStrictEqual(new CalendarDay('2024-05-06'));
    });
  });
  describe('getMonthOfYear', () => {
    it('should return a MonthOfYear instance', () => {
      const timestamp = new Timestamp('2024-05-06T09:35:53.205Z');
      const monthOfYear = timestamp.getMonthOfYear();
      expect(monthOfYear).toStrictEqual(
        new MonthOfYear(Month.MAY, new Year(2024)),
      );
    });

    it('should return the correct month and year', () => {
      const timestamp = new Timestamp('2024-05-06T09:35:53.205Z');
      const monthOfYear = timestamp.getMonthOfYear();
      expect(monthOfYear.getMonth()).toStrictEqual(Month.MAY);
      expect(monthOfYear.getYear()).toStrictEqual(new Year(2024));
    });

    it('should handle timestamps in different timezones correctly', () => {
      const timestamp = new Timestamp('2024-12-31T23:59:59.999Z');
      const monthOfYear = timestamp.getMonthOfYear();
      expect(monthOfYear.getMonth()).toStrictEqual(Month.DECEMBER);
      expect(monthOfYear.getYear()).toStrictEqual(new Year(2024));
    });

    it('should handle edge cases at the start of the year', () => {
      const timestamp = new Timestamp('2024-01-01T00:00:00.000Z');
      const monthOfYear = timestamp.getMonthOfYear();
      expect(monthOfYear.getMonth()).toStrictEqual(Month.JANUARY);
      expect(monthOfYear.getYear()).toStrictEqual(new Year(2024));
    });

    it('should handle edge cases at the end of the year', () => {
      const timestamp = new Timestamp('2024-12-31T23:59:59.999Z');
      const monthOfYear = timestamp.getMonthOfYear();
      expect(monthOfYear.getMonth()).toStrictEqual(Month.DECEMBER);
      expect(monthOfYear.getYear()).toStrictEqual(new Year(2024));
    });
  });
});
