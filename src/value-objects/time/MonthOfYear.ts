import { InvalidFormatError } from '../../errors/InvalidFormatError';
import { assert } from '../../patterns/Assert';
import { ValueObject } from '../ValueObject';
import { Month } from './Month';
import { Timestamp } from './Timestamp';
import { TimestampInterval } from './TimestampInterval';
import { Year } from './Year';

export class MonthOfYear extends ValueObject<string> {
  private readonly month!: Month;
  private readonly year!: Year;

  public static fromTimestamp(timestamp: Timestamp): MonthOfYear {
    return new MonthOfYear(timestamp.getMonth(), timestamp.getYear());
  }

  public static fromString(value: string): MonthOfYear {
    assert(/^[^/]+\/[^/]+$/.test(value), new InvalidFormatError(value));

    const [year, month] = value.split('/').map(Number);

    return new MonthOfYear(month, year);
  }

  constructor(month: number | Month, year: number | Year) {
    const hasValues =
      month !== null &&
      month !== undefined &&
      year !== null &&
      year !== undefined;

    super(
      hasValues
        ? year.valueOf().toString() +
            '/' +
            month.valueOf().toString().padStart(2, '0')
        : null,
    );

    if (!hasValues) {
      return this;
    }

    this.month = new Month(month.valueOf());
    this.year = new Year(year.valueOf());
  }

  public getMonth(): Month {
    return new Month(this.month.valueOf());
  }

  public getYear(): Year {
    return new Year(this.year);
  }

  public getNumberOfDays(): number {
    return new Date(this.year.valueOf(), this.month.valueOf(), 0).getDate();
  }

  public getTimestampInterval(): TimestampInterval {
    const firstMonthDay = '01';
    const month = this.month.valueOf().toString().padStart(2, '0');
    const lastDay = this.getNumberOfDays().toString();
    const startDate = new Timestamp(`${this.year}-${month}-${firstMonthDay}`);
    const endDate = new Timestamp(`${this.year}-${month}-${lastDay}`);

    return new TimestampInterval(startDate, endDate);
  }
}
