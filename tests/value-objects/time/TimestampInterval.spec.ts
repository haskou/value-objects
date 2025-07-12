import {
  TimestampInterval,
  Timestamp,
  PrimitiveOf,
  InvalidTimestampIntervalError,
  Duration,
  DayOfWeek,
} from '../../../src';

describe('TimestampInterval', () => {
  let timestampInterval: TimestampInterval;
  let startTimestamp: Timestamp;
  let endTimestamp: Timestamp;
  let primitives: PrimitiveOf<TimestampInterval>;

  beforeEach(() => {
    startTimestamp = new Timestamp(1721606400000);
    endTimestamp = new Timestamp(1722124800000);
    timestampInterval = new TimestampInterval(startTimestamp, endTimestamp);
    primitives = {
      start: startTimestamp.valueOf(),
      end: endTimestamp.valueOf(),
    };
  });

  describe('constructor', () => {
    it('should create a TimestampInterval instance', () => {
      expect(timestampInterval).toMatchObject({
        start: startTimestamp,
        end: endTimestamp,
      });
    });

    it('should throw error if the start is after the end', () => {
      expect(() => new TimestampInterval(endTimestamp, startTimestamp)).toThrow(
        InvalidTimestampIntervalError,
      );
    });
    it('should not throw error if the start and end are equal', () => {
      expect(
        () => new TimestampInterval(startTimestamp, startTimestamp),
      ).not.toThrow(InvalidTimestampIntervalError);
    });
  });

  describe('fromPrimitives', () => {
    it('should create a TimestampInterval instance from primitives', () => {
      const newTimestampInterval = TimestampInterval.fromPrimitives(primitives);
      expect(newTimestampInterval).toEqual(timestampInterval);
    });
  });

  describe('toPrimitives', () => {
    it('should return the correct primitives', () => {
      expect(timestampInterval.toPrimitives()).toEqual(primitives);
    });
  });

  describe('getStart', () => {
    it('should return the correct start timestamp', () => {
      expect(timestampInterval.getStart()).toEqual(startTimestamp);
    });
  });
  describe('getEnd', () => {
    it('should return the correct end timestamp', () => {
      expect(timestampInterval.getEnd()).toEqual(endTimestamp);
    });
  });

  describe('getDuration', () => {
    it('should return the correct duration', () => {
      expect(timestampInterval.getDuration()).toEqual(
        Duration.fromMilliseconds(518400000),
      );
    });
    describe('getDuration', () => {
      it('should return duration 0 when the start and end are equal', () => {
        const timestampInterval = new TimestampInterval(
          startTimestamp,
          startTimestamp,
        );

        expect(timestampInterval.getDuration()).toEqual(
          Duration.fromMilliseconds(0),
        );
      });
    });
  });

  describe('getNumberOfDayOfWeeks', () => {
    it('should return the number of day of weeks if the dayOfWeek is the same day as the starting day', () => {
      const dayOfWeek = DayOfWeek.MONDAY;
      const expectedCount = 1;
      expect(timestampInterval.getTotalDaysOfWeek(dayOfWeek)).toEqual(
        expectedCount,
      );
    });
    it('should return the number of day of weeks if the dayOfWeek is different than the starting day', () => {
      const dayOfWeek = DayOfWeek.SATURDAY;
      const expectedCount = 1;
      expect(timestampInterval.getTotalDaysOfWeek(dayOfWeek)).toEqual(
        expectedCount,
      );
    });
    it('should return the number of day of weeks if there are multiple day of weeks', () => {
      const dayOfWeek = DayOfWeek.TUESDAY;
      const expectedCount = 2;
      timestampInterval = new TimestampInterval(
        startTimestamp,
        new Timestamp(1722384000000),
      );

      expect(timestampInterval.getTotalDaysOfWeek(dayOfWeek)).toEqual(
        expectedCount,
      );
    });
    it('should return the only one day in one day interval', () => {
      const dayOfWeek = DayOfWeek.WEDNESDAY;
      const expectedCount = 1;
      timestampInterval = new TimestampInterval(
        new Timestamp('2024-07-24T00:00:00.000z'),
        new Timestamp('2024-07-24T23:59:00.000z'),
      );

      expect(timestampInterval.getTotalDaysOfWeek(dayOfWeek)).toEqual(
        expectedCount,
      );
    });
  });
  it('should not return the next day in one day interval', () => {
    const dayOfWeek = DayOfWeek.THURSDAY;
    const expectedCount = 0;
    timestampInterval = new TimestampInterval(
      new Timestamp('2024-07-24T00:00:00.000z'),
      new Timestamp('2024-07-24T23:59:00.000z'),
    );

    expect(timestampInterval.getTotalDaysOfWeek(dayOfWeek)).toEqual(
      expectedCount,
    );
  });
  it('should not return the previous day in one day interval', () => {
    const dayOfWeek = DayOfWeek.TUESDAY;
    const expectedCount = 0;
    timestampInterval = new TimestampInterval(
      new Timestamp('2024-07-24T00:00:00.000z'),
      new Timestamp('2024-07-24T23:59:00.000z'),
    );

    expect(timestampInterval.getTotalDaysOfWeek(dayOfWeek)).toEqual(
      expectedCount,
    );
  });

  describe('modifyStart', () => {
    it('should modify the start timestamp', () => {
      const newStartTimestamp = new Timestamp(1721606400000);
      timestampInterval.modifyStart(newStartTimestamp);
      expect(timestampInterval).toMatchObject({
        start: newStartTimestamp,
        end: endTimestamp,
      });
    });

    it('should throw error if the start is after the end', () => {
      const newStartTimestamp = new Timestamp(1722124800000);
      expect(() => timestampInterval.modifyStart(newStartTimestamp)).toThrow(
        InvalidTimestampIntervalError,
      );
    });
  });

  describe('modifyEnd', () => {
    it('should modify the end timestamp', () => {
      const newEndTimestamp = new Timestamp(1722124800000);
      timestampInterval.modifyEnd(newEndTimestamp);
      expect(timestampInterval).toMatchObject({
        start: startTimestamp,
        end: newEndTimestamp,
      });
    });

    it('should throw error if the start is after the end', () => {
      const newEndTimestamp = new Timestamp(1721606400000);
      expect(() => timestampInterval.modifyEnd(newEndTimestamp)).toThrow(
        InvalidTimestampIntervalError,
      );
    });
  });

  describe('getDaysBetweenInterval', () => {
    it('should return an array of dates in ISO format for the given interval', () => {
      const start = new Timestamp('2024-11-18T00:00:00.000Z');
      const end = new Timestamp('2024-11-22T00:00:00.000Z');
      timestampInterval = new TimestampInterval(start, end);
      const days = timestampInterval.getDaysBetweenInterval();
      expect(days).toMatchObject([
        {
          year: 2024,
          month: 11,
          day: 18,
        },
        {
          year: 2024,
          month: 11,
          day: 19,
        },
        {
          year: 2024,
          month: 11,
          day: 20,
        },
        {
          year: 2024,
          month: 11,
          day: 21,
        },
        {
          year: 2024,
          month: 11,
          day: 22,
        },
      ]);
    });
    it('should return a single day if the start and end are the same', () => {
      const start = new Timestamp('2024-11-19T00:00:00.000Z');
      const end = new Timestamp('2024-11-19T00:00:00.000Z');
      timestampInterval = new TimestampInterval(start, end);
      const days = timestampInterval.getDaysBetweenInterval();
      expect(days).toMatchObject([
        {
          year: 2024,
          month: 11,
          day: 19,
        },
      ]);
    });
    it('should not modify the original values', () => {
      const primitiveStart = '2024-11-18T00:00:00.000Z';
      const primitiveEnd = '2024-11-22T00:00:00.000Z';
      const start = new Timestamp(primitiveStart);
      const end = new Timestamp(primitiveEnd);
      timestampInterval = new TimestampInterval(start, end);
      const days = timestampInterval.getDaysBetweenInterval();
      expect(days).toMatchObject([
        {
          year: 2024,
          month: 11,
          day: 18,
        },
        {
          year: 2024,
          month: 11,
          day: 19,
        },
        {
          year: 2024,
          month: 11,
          day: 20,
        },
        {
          year: 2024,
          month: 11,
          day: 21,
        },
        {
          year: 2024,
          month: 11,
          day: 22,
        },
      ]);
      expect(timestampInterval).toMatchObject({
        start: new Timestamp(primitiveStart),
        end: new Timestamp(primitiveEnd),
      });
    });
  });

  describe('getOverlappingInterval', () => {
    it('should return the overlapping interval when there is overlap', () => {
      const interval = new TimestampInterval(
        new Timestamp(1721779200000),
        new Timestamp(1722307200000),
      );

      const result = timestampInterval.getOverlappingInterval(interval);

      expect(result).toEqual(
        new TimestampInterval(
          new Timestamp(1721779200000),
          new Timestamp(1722124800000),
        ),
      );
    });

    it('should return the same overlapping interval when there is overlap if the variables are reversed', () => {
      const interval = new TimestampInterval(
        new Timestamp(1721779200000),
        new Timestamp(1722307200000),
      );

      const result = interval.getOverlappingInterval(timestampInterval);

      expect(result).toEqual(
        new TimestampInterval(
          new Timestamp(1721779200000),
          new Timestamp(1722124800000),
        ),
      );
    });

    it('should return null when there is no overlap', () => {
      const interval = new TimestampInterval(
        new Timestamp(1722307200000),
        new Timestamp(1722912000000),
      );

      const result = timestampInterval.getOverlappingInterval(interval);

      expect(result).toBeNull();
    });

    it('should return the full interval when one interval is fully contained within another', () => {
      const interval = new TimestampInterval(
        new Timestamp(1721692800000),
        new Timestamp(1722048000000),
      );

      const result = timestampInterval.getOverlappingInterval(interval);

      expect(result).toEqual(interval);
    });

    it('should handle identical intervals correctly', () => {
      const interval = new TimestampInterval(
        new Timestamp(1721606400000),
        new Timestamp(1722124800000),
      );

      const result = timestampInterval.getOverlappingInterval(interval);

      expect(result).toEqual(timestampInterval);
    });

    it('should handle intervals that touch but do not overlap', () => {
      const interval = new TimestampInterval(
        new Timestamp(1722124800000),
        new Timestamp(1722307200000),
      );

      const result = timestampInterval.getOverlappingInterval(interval);

      expect(result).toBeNull();
    });
  });

  describe('includes', () => {
    it('should return true if the timestamp is within the interval', () => {
      const timestamp = new Timestamp(1721692800000);
      expect(timestampInterval.includes(timestamp)).toBeTruthy();
    });

    it('should return false if the timestamp is before the interval', () => {
      const timestamp = new Timestamp(1721606399999);
      expect(timestampInterval.includes(timestamp)).toBeFalsy();
    });

    it('should return false if the timestamp is after the interval', () => {
      const timestamp = new Timestamp(1722124800001);
      expect(timestampInterval.includes(timestamp)).toBeFalsy();
    });

    it('should return true if the timestamp is the same as the start of the interval', () => {
      const timestamp = new Timestamp(1721606400000);
      expect(timestampInterval.includes(timestamp)).toBeTruthy();
    });

    it('should return true if the timestamp is the same as the end of the interval', () => {
      const timestamp = new Timestamp(1722124800000);
      expect(timestampInterval.includes(timestamp)).toBeTruthy();
    });
  });
});
