import { InvalidDayError } from '../../errors/InvalidDayError';
import { InvalidDayFormatError } from '../../errors/InvalidDayFormatError';
import { ValueObject } from '../../patterns';
import { assert } from '../../patterns/Assert';
import { Day } from './Day';
import { DayOfWeek } from './DayOfWeek';
import { Month } from './Month';
import { MonthOfYear } from './MonthOfYear';
import { Timestamp } from './Timestamp';

export class CalendarDay extends ValueObject<string> {
  private readonly year: number;
  private readonly month: number;
  private readonly day: number;

  private static ensureIsValidValue(
    value: string | Date | number | Timestamp,
  ): void {
    if (typeof value == 'string') {
      this.ensureIsValidString(value);
    }
    this.ensureIsValidDate(new Date(value.valueOf()));
  }

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
    assert(!isNaN(value.valueOf()), new InvalidDayError(value));
  }

  constructor(value?: string | Date | number | Timestamp) {
    let timestamp: Timestamp;

    if (value) {
      CalendarDay.ensureIsValidValue(value);
      timestamp = new Timestamp(value);
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
    return new Timestamp(Date.UTC(this.year, this.month - 1, this.day));
  }
}
