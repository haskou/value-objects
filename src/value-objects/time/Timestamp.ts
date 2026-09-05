import { InvalidIntegerError } from '../../errors/InvalidIntegerError';
import { InvalidNumberError } from '../../errors/InvalidNumberError';
import { assert } from '../../patterns/Assert';
import { NumberValueObject } from '../NumberValueObject';
import { ValueObject } from '../ValueObject';
import { CalendarDay } from './CalendarDay';
import { Day } from './Day';
import { Duration } from './Duration';
import { Month } from './Month';
import { MonthOfYear } from './MonthOfYear';
import { Year } from './Year';

type TimestampValue = number | Date | Timestamp | string;

export class Timestamp extends ValueObject<number> {
  private static readonly FACTORS = {
    DAYS: 24 * 60 * 60 * 1000,
    HOURS: 60 * 60 * 1000,
    MINUTES: 60 * 1000,
    SECONDS: 1000,
    WEEKS: 7 * 24 * 60 * 60 * 1000,
  };

  private static valueMilliseconds(value?: TimestampValue): number {
    if (value instanceof Timestamp || value instanceof Date) {
      return value.valueOf();
    }

    if (typeof value === 'number') {
      return value;
    }

    if (typeof value === 'string') {
      return new Date(value).valueOf();
    }

    return Date.now().valueOf();
  }

  private static getLastDayOfUtcMonth(year: number, month: number): number {
    const normalizedYear = year + Math.floor(month / 12);
    const normalizedMonth = ((month % 12) + 12) % 12;
    const days = [
      31,
      new Year(normalizedYear).isLeapYear() ? 29 : 28,
      31,
      30,
      31,
      30,
      31,
      31,
      30,
      31,
      30,
      31,
    ];

    return days[normalizedMonth];
  }

  private static ensureCalendarDelta(value: number): void {
    assert(Number.isInteger(value), new InvalidIntegerError(value));
  }

  private static createUtcCalendarValue(
    sourceValue: number,
    year: number,
    month: number,
    day: number,
  ): number {
    const integerValue = Math.floor(sourceValue);
    const fractionalMilliseconds = sourceValue - integerValue;
    const source = new Date(integerValue);
    const target = new Date(0);

    target.setUTCFullYear(year, month, day);
    target.setUTCHours(
      source.getUTCHours(),
      source.getUTCMinutes(),
      source.getUTCSeconds(),
      source.getUTCMilliseconds(),
    );

    return target.valueOf() + fractionalMilliseconds;
  }

  public static new(value: TimestampValue): Timestamp {
    return new Timestamp(value);
  }

  public static now(): Timestamp {
    return new Timestamp();
  }

  public static fromSeconds(seconds: number | NumberValueObject): Timestamp {
    return new Timestamp(seconds.valueOf() * Timestamp.FACTORS.SECONDS);
  }

  public constructor(value?: TimestampValue) {
    super(Timestamp.valueMilliseconds(value));

    assert(
      Number.isFinite(new Date(this.value).valueOf()),
      new InvalidNumberError(this.value),
    );
  }

  public toExactHour(): Timestamp {
    const date = new Date(this.valueOf());

    date.setSeconds(0);
    date.setMinutes(0);
    date.setMilliseconds(0);

    const value = Timestamp.new(date.getTime()).value;

    return this.clone(value);
  }

  public toMilliseconds(): number {
    return this.value;
  }

  public toSeconds(): number {
    return Math.round(this.value / Timestamp.FACTORS.SECONDS);
  }

  public toDate(): Date {
    return new Date(this.value);
  }

  public toString(): string {
    return `${this.valueOf()}`;
  }

  public isBefore(other: Timestamp): boolean {
    return this.value < other.valueOf();
  }

  public isAfter(other: Timestamp): boolean {
    return this.value > other.valueOf();
  }

  public isBeforeOrEqual(other: Timestamp): boolean {
    return this.value <= other.valueOf();
  }

  public isAfterOrEqual(other: Timestamp): boolean {
    return this.value >= other.valueOf();
  }

  public addMilliseconds(milliseconds: number | NumberValueObject): Timestamp {
    const value = this.value + milliseconds.valueOf();

    return this.clone(value);
  }

  public addSeconds(seconds: number | NumberValueObject): Timestamp {
    const value = this.value + seconds.valueOf() * Timestamp.FACTORS.SECONDS;

    return this.clone(value);
  }

  public addMinutes(minutes: number | NumberValueObject): Timestamp {
    const value = this.value + minutes.valueOf() * Timestamp.FACTORS.MINUTES;

    return this.clone(value);
  }

  public addHours(hours: number | NumberValueObject): Timestamp {
    const value = this.value + hours.valueOf() * Timestamp.FACTORS.HOURS;

    return this.clone(value);
  }

  public addDays(days: number | NumberValueObject): Timestamp {
    const value = this.value + days.valueOf() * Timestamp.FACTORS.DAYS;

    return this.clone(value);
  }

  public addWeeks(weeks: number | NumberValueObject): Timestamp {
    const value = this.value + weeks.valueOf() * Timestamp.FACTORS.WEEKS;

    return this.clone(value);
  }

  public addMonths(months: number | NumberValueObject): Timestamp {
    const delta = months.valueOf();
    Timestamp.ensureCalendarDelta(delta);

    const source = new Date(Math.floor(this.value));
    const totalMonths =
      source.getUTCFullYear() * 12 + source.getUTCMonth() + delta;
    const targetYear = Math.floor(totalMonths / 12);
    const targetMonth = totalMonths - targetYear * 12;
    const targetDay = Math.min(
      source.getUTCDate(),
      Timestamp.getLastDayOfUtcMonth(targetYear, targetMonth),
    );

    return this.clone(
      Timestamp.createUtcCalendarValue(
        this.value,
        targetYear,
        targetMonth,
        targetDay,
      ),
    );
  }

  public addYears(years: number | NumberValueObject): Timestamp {
    const delta = years.valueOf();
    Timestamp.ensureCalendarDelta(delta);

    const source = new Date(Math.floor(this.value));
    const targetYear = source.getUTCFullYear() + delta;
    const targetMonth = source.getUTCMonth();
    const targetDay = Math.min(
      source.getUTCDate(),
      Timestamp.getLastDayOfUtcMonth(targetYear, targetMonth),
    );

    return this.clone(
      Timestamp.createUtcCalendarValue(
        this.value,
        targetYear,
        targetMonth,
        targetDay,
      ),
    );
  }

  public addDuration(duration: Duration): Timestamp {
    const value = this.value + duration.valueOf();

    return this.clone(value);
  }

  public isSameDay(other: Timestamp): boolean {
    return this.getCalendarDay().isEqual(other.getCalendarDay());
  }

  public isSameMonth(other: Timestamp): boolean {
    return this.getMonthOfYear().isEqual(other.getMonthOfYear());
  }

  public isSameYear(other: Timestamp): boolean {
    return this.getYear().isEqual(other.getYear());
  }

  public getCalendarDay(): CalendarDay {
    return new CalendarDay(this);
  }

  public getDay(): Day {
    return new Day(this.toDate().getUTCDate());
  }

  public getMonth(): Month {
    return new Month(this.toDate().getUTCMonth() + 1);
  }

  public getYear(): Year {
    return new Year(this.toDate().getUTCFullYear());
  }

  public getHours(): number {
    return this.toDate().getUTCHours();
  }

  public getMinutes(): number {
    return this.toDate().getUTCMinutes();
  }

  public getSeconds(): number {
    return this.toDate().getUTCSeconds();
  }

  public getMilliseconds(): number {
    return this.toDate().getUTCMilliseconds();
  }

  public getDayOfWeek(): number {
    return this.toDate().getUTCDay();
  }

  public getMonthOfYear(): MonthOfYear {
    return new MonthOfYear(this.getMonth(), this.getYear());
  }
}
