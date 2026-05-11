import { InvalidHourError } from '../../errors/InvalidHourError';
import { InvalidMinutesError } from '../../errors/InvalidMinutesError';
import { assert } from '../../patterns/Assert';
import { StringValueObject } from '../StringValueObject';

export class Hour extends StringValueObject {
  private static readonly FORMAT_REGEX = /^\d{1,2}:\d{1,2}$/;
  private readonly minutes: string;
  private readonly hours: string;

  private static addTrailZero(value: number): string {
    return value < 10 ? `0${value}` : value.toString();
  }

  private static normalizeMinutes(totalMinutes: number): number {
    const minutesPerDay = 24 * 60;

    return ((totalMinutes % minutesPerDay) + minutesPerDay) % minutesPerDay;
  }

  private static parseFromNumber(value: number, minutes: number): string[] {
    assert(
      Number.isInteger(value) && value >= 0 && value <= 23,
      new InvalidHourError(),
    );
    assert(
      Number.isInteger(minutes) && minutes >= 0 && minutes <= 59,
      new InvalidMinutesError(),
    );

    return [Hour.addTrailZero(value), Hour.addTrailZero(minutes)];
  }

  private static parseFromString(value: string): string[] {
    assert(Hour.FORMAT_REGEX.test(value), new InvalidHourError());
    const [hours, minutes] = value.split(':');
    const parsedHours = Number(hours);
    const parsedMinutes = Number(minutes);

    assert(parsedHours >= 0 && parsedHours <= 23, new InvalidHourError());
    assert(
      parsedMinutes >= 0 && parsedMinutes <= 59,
      new InvalidMinutesError(),
    );

    return [Hour.addTrailZero(parsedHours), Hour.addTrailZero(parsedMinutes)];
  }

  constructor(value: string);
  constructor(value: number, minutes?: number);
  constructor(value: string | number, minutes?: number) {
    const [parsedHours, parsedMinutes] =
      typeof value === 'number' && minutes !== undefined
        ? Hour.parseFromNumber(value, minutes)
        : Hour.parseFromString(value as string);

    super(`${parsedHours}:${parsedMinutes}`);
    this.hours = parsedHours;
    this.minutes = parsedMinutes;
  }

  public addMinutes(minutes: number): Hour {
    const currentMinutes = Number(this.hours) * 60 + Number(this.minutes);
    const normalizedMinutes = Hour.normalizeMinutes(currentMinutes + minutes);
    const newHour = Math.floor(normalizedMinutes / 60);
    const newMinutes = normalizedMinutes % 60;

    return new Hour(newHour, newMinutes);
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
