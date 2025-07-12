import { InvalidTimestampIntervalError } from '../../errors/InvalidTimestampIntervalError';
import { PrimitiveOf } from '../../interfaces/PrimitiveOf';
import { assert } from '../../patterns/Assert';
import { ValueObject } from '../../patterns/ValueObject';
import { PositiveNumber } from '../PositiveNumber';
import { CalendarDay } from './CalendarDay';
import { DayOfWeek } from './DayOfWeek';
import { Duration } from './Duration';
import { Timestamp } from './Timestamp';

export class TimestampInterval extends ValueObject<string> {
  public static fromPrimitives(
    primitives: PrimitiveOf<TimestampInterval>,
  ): TimestampInterval {
    return new TimestampInterval(
      new Timestamp(primitives.start),
      new Timestamp(primitives.end),
    );
  }

  constructor(
    private start: Timestamp,
    private end: Timestamp,
  ) {
    super(`${start.valueOf()}-${end.valueOf()}`);

    assert(
      start.isBeforeOrEqual(end),
      new InvalidTimestampIntervalError(start, end),
    );
  }

  public toPrimitives() {
    return {
      end: this.end.valueOf(),
      start: this.start.valueOf(),
    };
  }

  public getStart(): Timestamp {
    return this.start;
  }

  public getEnd(): Timestamp {
    return this.end;
  }

  public getDuration(): Duration {
    return new Duration(
      new PositiveNumber(this.end.valueOf() - this.start.valueOf()),
    );
  }

  public getTotalDaysOfWeek(dayOfWeek: DayOfWeek): number {
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
    const daysToCheck: number = Math.trunc(
      this.getDuration().valueOf() / oneDayInMilliseconds,
    );

    let count = 0;

    for (let daysChecked = 0; daysChecked <= daysToCheck; daysChecked++) {
      const iteratorDay = new Timestamp(this.start).addDays(daysChecked);

      if (iteratorDay.getDayOfWeek() === dayOfWeek.toNumber()) {
        count++;
      }
    }

    return count;
  }

  public modifyStart(start: Timestamp): void {
    const end = this.end;
    assert(start.isBefore(end), new InvalidTimestampIntervalError(start, end));
    this.start = start;
  }

  public modifyEnd(end: Timestamp): void {
    const start = this.start;
    assert(start.isBefore(end), new InvalidTimestampIntervalError(start, end));
    this.end = end;
  }

  public getDaysBetweenInterval(): CalendarDay[] {
    const days: CalendarDay[] = [];

    let iteratorTimestamp = new Timestamp(this.getStart());
    const endTimestamp = new Timestamp(this.getEnd());

    while (iteratorTimestamp.isBeforeOrEqual(endTimestamp)) {
      days.push(new CalendarDay(iteratorTimestamp));
      iteratorTimestamp = iteratorTimestamp.addDays(1);
    }

    return days;
  }

  public getOverlappingInterval(
    searchInterval: TimestampInterval,
  ): TimestampInterval | null {
    const start = this.start.isAfter(searchInterval.getStart())
      ? this.start
      : searchInterval.getStart();
    const end = this.end.isBefore(searchInterval.getEnd())
      ? this.end
      : searchInterval.getEnd();

    if (start.isAfterOrEqual(end)) {
      return null;
    }

    return new TimestampInterval(start, end);
  }

  public includes(timestamp: Timestamp): boolean {
    return (
      timestamp.isAfterOrEqual(this.start) &&
      timestamp.isBeforeOrEqual(this.end)
    );
  }
}
