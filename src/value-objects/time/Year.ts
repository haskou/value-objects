import { NullObject } from '../../patterns/NullObject';
import { Integer } from '../Integer';
import { NumberValueObject } from '../NumberValueObject';

export class Year extends Integer {
  private static readonly YEAR_DAYS = 365;
  private static readonly LEAP_YEAR_DAYS = 366;

  constructor(value: number | NumberValueObject) {
    super(value?.valueOf());

    if (NullObject.isNullObject(this)) {
      return this;
    }
  }

  public isLeapYear(): boolean {
    return this.getNumberOfDays() === Year.LEAP_YEAR_DAYS;
  }

  public getNumberOfDays(): number {
    return (this.value % 4 === 0 && this.value % 100 !== 0) ||
      this.value % 400 === 0
      ? Year.LEAP_YEAR_DAYS
      : Year.YEAR_DAYS;
  }
}
