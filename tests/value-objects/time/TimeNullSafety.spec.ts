import {
  CalendarDay,
  Coordinates,
  Day,
  Duration,
  Hour,
  Latitude,
  Longitude,
  MonthOfYear,
  NullObject,
  Timestamp,
  TimestampInterval,
} from '../../../src';

describe('Null safety', () => {
  const nullish = [null, undefined] as unknown[];

  it.each(nullish)('should create NullObjects from %s', (value) => {
    const created = [
      new Day(value as number),
      new Duration(value as Duration),
      new Hour(value as string),
      new Latitude(value as number),
      new Longitude(value as number),
      new Coordinates(value as number, value as number),
      new MonthOfYear(value as number, value as number),
      new TimestampInterval(value as Timestamp, value as Timestamp),
    ];

    created.forEach((object) =>
      expect(NullObject.isNullObject(object)).toBeTrue(),
    );
  });

  it('should create a NullObject CalendarDay from null only', () => {
    expect(NullObject.isNullObject(new CalendarDay(null as never))).toBeTrue();
    expect(NullObject.isNullObject(new CalendarDay())).toBeFalse();
  });

  it('should create a NullObject when only part of a composite is missing', () => {
    expect(
      NullObject.isNullObject(new Coordinates(1, null as never)),
    ).toBeTrue();
    expect(
      NullObject.isNullObject(new Coordinates(null as never, 1)),
    ).toBeTrue();
    expect(
      NullObject.isNullObject(new MonthOfYear(1, null as never)),
    ).toBeTrue();
    expect(
      NullObject.isNullObject(new MonthOfYear(null as never, 2024)),
    ).toBeTrue();
  });

  it('should still reject malformed MonthOfYear strings', () => {
    expect(() => MonthOfYear.fromString('2022')).toThrow();
  });
});
