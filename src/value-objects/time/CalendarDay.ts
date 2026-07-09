import { InvalidDayError } from '../../errors/InvalidDayError';
import { InvalidDayFormatError } from '../../errors/InvalidDayFormatError';
import { assert } from '../../patterns/Assert';
import { ValueObject } from '../ValueObject';
import { Day } from './Day';
import { DayOfWeek } from './DayOfWeek';
import { Month } from './Month';
import { MonthOfYear } from './MonthOfYear';
import { Timestamp } from './Timestamp';

export class CalendarDay extends ValueObject<string> {
  private readonly year: number;
  private readonly month: number;
  private readonly day: number;

  private static ensureIsValidString(value: string): void {
    assert(
      value.match(/^\d{4}-\d{1,2}-\d{1,2}$/),
      new InvalidDayFormatError(value),
    );
  }

  private static generateStringValue(timestamp: Timestamp): string {
    const paddedMonth = timestamp.getMonth().toString().padStart(2, '0');
    const paddedDay = timestamp.getDay().toString().padStart(2, '0');

    return `${timestamp.getYear().toString()}-${paddedMonth}-${paddedDay}`;
  }

  private static ensureIsValidDate(value: Date | number | Timestamp): void {
    assert(Number.isFinite(value.valueOf()), new InvalidDayError(value));
  }

  private static timestampFromString(value: string): Timestamp {
    CalendarDay.ensureIsValidString(value);

    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(0);
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCFullYear(year, month - 1, day);

    assert(
      date.getUTCFullYear() === year &&
        date.getUTCMonth() === month - 1 &&
        date.getUTCDate() === day,
      new InvalidDayError(value),
    );

    return new Timestamp(date);
  }

  private static timestampFromValue(
    value: string | Date | number | Timestamp,
  ): Timestamp {
    if (typeof value === 'string') {
      return CalendarDay.timestampFromString(value);
    }

    CalendarDay.ensureIsValidDate(value);

    return new Timestamp(value);
  }

  constructor(value?: string | Date | number | Timestamp) {
    let timestamp: Timestamp;

    if (value !== undefined) {
      timestamp = CalendarDay.timestampFromValue(value);
    } else {
      timestamp = new Timestamp();
    }

    super(CalendarDay.generateStringValue(timestamp));

    this.year = timestamp.getYear().valueOf();
    this.month = timestamp.getMonth().getIndex() + 1;
    this.day = timestamp.getDay().valueOf();
  }

  public isAfter(date: CalendarDay): boolean {
    return this.valueOf() > date.valueOf();
  }

  public isBefore(date: CalendarDay): boolean {
    return this.valueOf() < date.valueOf();
  }

  public getYear(): number {
    return this.year;
  }

  public getMonth(): Month {
    return new Month(this.month);
  }

  public getMonthOfYear(): MonthOfYear {
    return new MonthOfYear(this.month, this.year);
  }

  public getDay(): Day {
    return new Day(this.day);
  }

  public getDayOfWeek(): DayOfWeek {
    return DayOfWeek.fromNumber(this.toTimestamp().getDayOfWeek());
  }

  public toTimestamp(): Timestamp {
    const date = new Date(0);
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCFullYear(this.year, this.month - 1, this.day);

    return new Timestamp(date);
  }
}
