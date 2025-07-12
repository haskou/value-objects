import { NumberValueObject } from '../NumberValueObject';

export class Duration extends NumberValueObject {
  private static readonly MILLISECOND_FACTOR = 1000;
  private static readonly SECOND_UNITS = {
    DAYS: 24 * 60 * 60,
    HOURS: 60 * 60,
    MINUTES: 60,
    MONTHS: 30 * 24 * 60 * 60,
    SECONDS: 1,
    WEEKS: 7 * 24 * 60 * 60,
    YEARS: 365 * 24 * 60 * 60,
  };

  private static readonly millisecondFactors = {
    DAYS: new NumberValueObject(
      this.SECOND_UNITS.DAYS * this.MILLISECOND_FACTOR,
    ),
    HOURS: new NumberValueObject(
      this.SECOND_UNITS.HOURS * this.MILLISECOND_FACTOR,
    ),
    MINUTES: new NumberValueObject(
      this.SECOND_UNITS.MINUTES * this.MILLISECOND_FACTOR,
    ),
    MONTHS: new NumberValueObject(
      this.SECOND_UNITS.MONTHS * this.MILLISECOND_FACTOR,
    ),
    SECONDS: new NumberValueObject(
      this.SECOND_UNITS.SECONDS * this.MILLISECOND_FACTOR,
    ),
    WEEKS: new NumberValueObject(
      this.SECOND_UNITS.WEEKS * this.MILLISECOND_FACTOR,
    ),
    YEARS: new NumberValueObject(
      this.SECOND_UNITS.YEARS * this.MILLISECOND_FACTOR,
    ),
  };

  public static fromDays(days: number | NumberValueObject): Duration {
    return new Duration(
      new NumberValueObject(days.valueOf()).multiply(
        this.millisecondFactors.DAYS,
      ),
    );
  }

  public static fromHours(hours: number | NumberValueObject): Duration {
    return new Duration(
      new NumberValueObject(hours.valueOf()).multiply(
        this.millisecondFactors.HOURS,
      ),
    );
  }

  public static fromMinutes(minutes: number | NumberValueObject): Duration {
    return new Duration(
      new NumberValueObject(minutes.valueOf()).multiply(
        this.millisecondFactors.MINUTES,
      ),
    );
  }

  public static fromSeconds(seconds: number | NumberValueObject): Duration {
    return new Duration(
      new NumberValueObject(seconds.valueOf()).multiply(
        this.millisecondFactors.SECONDS,
      ),
    );
  }

  public static fromMilliseconds(
    milliseconds: number | NumberValueObject,
  ): Duration {
    return new Duration(new NumberValueObject(milliseconds.valueOf()));
  }

  constructor(milliseconds: NumberValueObject | Duration) {
    super(milliseconds.valueOf());
  }

  public getTotalDays(): NumberValueObject {
    return new Duration(this).divide(Duration.millisecondFactors.DAYS);
  }

  public getTotalHours(): NumberValueObject {
    return new Duration(this).divide(Duration.millisecondFactors.HOURS);
  }

  public getTotalMinutes(): NumberValueObject {
    return new Duration(this).divide(Duration.millisecondFactors.MINUTES);
  }

  public getTotalSeconds(): NumberValueObject {
    return new Duration(this).divide(Duration.millisecondFactors.SECONDS);
  }

  public getTotalMilliseconds(): NumberValueObject {
    return new NumberValueObject(this.valueOf());
  }

  public getDays(): NumberValueObject {
    return new NumberValueObject(
      Math.floor(
        new Duration(this).divide(Duration.millisecondFactors.DAYS).valueOf(),
      ) % Duration.SECOND_UNITS.DAYS,
    );
  }

  public getHours(): NumberValueObject {
    return new NumberValueObject(
      Math.floor(
        new Duration(this).divide(Duration.millisecondFactors.HOURS).valueOf(),
      ) % Duration.SECOND_UNITS.HOURS,
    );
  }

  public getMinutes(): NumberValueObject {
    return new NumberValueObject(
      Math.floor(
        new Duration(this)
          .divide(Duration.millisecondFactors.MINUTES)
          .valueOf(),
      ) % Duration.SECOND_UNITS.MINUTES,
    );
  }

  public getSeconds(): NumberValueObject {
    return new NumberValueObject(
      Math.floor(
        new Duration(this)
          .divide(Duration.millisecondFactors.SECONDS)
          .valueOf(),
      ) % Duration.SECOND_UNITS.MINUTES,
    );
  }

  public getMilliseconds(): NumberValueObject {
    return new NumberValueObject(
      Math.floor(new Duration(this).valueOf()) % Duration.MILLISECOND_FACTOR,
    );
  }
}
