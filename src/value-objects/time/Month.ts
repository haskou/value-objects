import { Enum } from '../Enum';

enum MonthEnum {
  JANUARY = 1,
  FEBRUARY = 2,
  MARCH = 3,
  APRIL = 4,
  MAY = 5,
  JUNE = 6,
  JULY = 7,
  AUGUST = 8,
  SEPTEMBER = 9,
  OCTOBER = 10,
  NOVEMBER = 11,
  DECEMBER = 12,
}

export class Month extends Enum<number> {
  public static readonly JANUARY = new Month(MonthEnum.JANUARY);
  public static readonly FEBRUARY = new Month(MonthEnum.FEBRUARY);
  public static readonly MARCH = new Month(MonthEnum.MARCH);
  public static readonly APRIL = new Month(MonthEnum.APRIL);
  public static readonly MAY = new Month(MonthEnum.MAY);
  public static readonly JUNE = new Month(MonthEnum.JUNE);
  public static readonly JULY = new Month(MonthEnum.JULY);
  public static readonly AUGUST = new Month(MonthEnum.AUGUST);
  public static readonly SEPTEMBER = new Month(MonthEnum.SEPTEMBER);
  public static readonly OCTOBER = new Month(MonthEnum.OCTOBER);
  public static readonly NOVEMBER = new Month(MonthEnum.NOVEMBER);
  public static readonly DECEMBER = new Month(MonthEnum.DECEMBER);

  public getValues(): number[] {
    return Object.values(MonthEnum) as number[];
  }

  public getIndex(): number {
    return Number(this.valueOf()) - 1;
  }
}
