import { InvalidHourError } from '../../errors/InvalidHourError';
import { InvalidMinutesError } from '../../errors/InvalidMinutesError';
import { assert } from '../../patterns/Assert';
import { StringValueObject } from '../StringValueObject';

export class Hour extends StringValueObject {
  private readonly minutes: string;
  private readonly hours: string;
  private static addTrailZero(value: string): string {
    return Number(value) < 10 ? `0${Number(value)}` : value;
  }

  constructor(value: string);
  constructor(value: number, minutes?: number);
  constructor(value: string | number, minutes?: number) {
    let parsedHours: string;
    let parsedMinutes: string;

    if (typeof value === 'number' && minutes !== undefined) {
      assert(Number(value) >= 0 && Number(value) <= 23, new InvalidHourError());
      assert(
        Number(minutes) >= 0 && Number(minutes) <= 59,
        new InvalidMinutesError(),
      );

      parsedHours = Hour.addTrailZero(value.toString());
      parsedMinutes = Hour.addTrailZero(minutes.toString());
    } else {
      assert(typeof value === 'string', new InvalidHourError());
      assert((value as string).includes(':'), new InvalidHourError());
      const [hours, minutes] = (value as string).split(':');

      assert(Number(hours) >= 0 && Number(hours) <= 23, new InvalidHourError());
      assert(
        Number(minutes) >= 0 && Number(minutes) <= 59,
        new InvalidMinutesError(),
      );
      parsedHours = Hour.addTrailZero(hours);
      parsedMinutes = Hour.addTrailZero(minutes);
    }

    super(`${parsedHours}:${parsedMinutes}`);
    this.hours = parsedHours;
    this.minutes = parsedMinutes;
  }

  public addMinutes(minutes: number): Hour {
    const totalMinutes = Number(this.minutes) + minutes;
    let newHour = Number(this.hours) + Math.floor(totalMinutes / 60);
    let newMinutes = totalMinutes % 60;

    if (newHour > 23) {
      newHour = newHour - 24;
    } else if (newHour < 0) {
      newHour = 24 + newHour;
    }

    if (newMinutes < 0) {
      newMinutes = 60 + newMinutes;
    }

    return new Hour(`${newHour}:${newMinutes}`);
  }

  public diffInMinutes(other: Hour): number {
    let endHour = Number(other.hours);

    if (
      other.hours < this.hours ||
      (other.hours === this.hours && other.minutes < this.minutes)
    ) {
      endHour += 24;
    }

    const totalMinutes =
      (endHour - Number(this.hours)) * 60 +
      (Number(other.minutes) - Number(this.minutes));

    return totalMinutes;
  }

  public getMinutes(): number {
    return Number(this.minutes);
  }

  public getHours(): number {
    return Number(this.hours);
  }

  public isGreaterThan(hour: Hour): boolean {
    if (this.hours === hour.hours) {
      return Number(this.minutes) > Number(hour.minutes);
    }

    return Number(this.hours) > Number(hour.hours);
  }

  public isLessThan(hour: Hour): boolean {
    if (this.hours === hour.hours) {
      return Number(this.minutes) < Number(hour.minutes);
    }

    return Number(this.hours) < Number(hour.hours);
  }
}
