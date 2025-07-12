import { InvalidDayError } from '../../errors/InvalidDayError';
import { Enum } from '../Enum';
import { Timestamp } from './Timestamp';

export enum EDaysOfWeek {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
}

export const timeStampDayToDaysMap = {
  [EDaysOfWeek.FRIDAY]: 5,
  [EDaysOfWeek.MONDAY]: 1,
  [EDaysOfWeek.SATURDAY]: 6,
  [EDaysOfWeek.SUNDAY]: 0,
  [EDaysOfWeek.THURSDAY]: 4,
  [EDaysOfWeek.TUESDAY]: 2,
  [EDaysOfWeek.WEDNESDAY]: 3,
};

export class DayOfWeek extends Enum {
  public static MONDAY = new DayOfWeek(EDaysOfWeek.MONDAY);
  public static TUESDAY = new DayOfWeek(EDaysOfWeek.TUESDAY);
  public static WEDNESDAY = new DayOfWeek(EDaysOfWeek.WEDNESDAY);
  public static THURSDAY = new DayOfWeek(EDaysOfWeek.THURSDAY);
  public static FRIDAY = new DayOfWeek(EDaysOfWeek.FRIDAY);
  public static SATURDAY = new DayOfWeek(EDaysOfWeek.SATURDAY);
  public static SUNDAY = new DayOfWeek(EDaysOfWeek.SUNDAY);

  public static fromNumber(day: number): DayOfWeek {
    const [eDay] =
      Object.entries(timeStampDayToDaysMap).find(
        ([, value]) => value === day,
      ) || [];

    if (!eDay) {
      throw new InvalidDayError(eDay);
    }

    return new DayOfWeek(eDay);
  }

  public static fromTimestamp(timestamp: Timestamp): DayOfWeek {
    const dayOfWeekNumber = timestamp.getDayOfWeek();

    return DayOfWeek.fromNumber(dayOfWeekNumber);
  }

  public getValues(): string[] {
    return Object.values(EDaysOfWeek);
  }

  public toNumber(): number {
    return timeStampDayToDaysMap[this.value as EDaysOfWeek];
  }
}
