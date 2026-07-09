import { InvalidLongitudeError } from '../../errors/InvalidLongitudeError';
import { assert } from '../../patterns/Assert';
import { NumberValueObject } from '../NumberValueObject';

export class Longitude extends NumberValueObject {
  private static MIN_VALUE = new NumberValueObject(-180);
  private static MAX_VALUE = new NumberValueObject(180);

  private static isValid(value: number | NumberValueObject): boolean {
    const primitive = value.valueOf();

    return (
      Number.isFinite(primitive) &&
      primitive >= this.MIN_VALUE.valueOf() &&
      primitive <= this.MAX_VALUE.valueOf()
    );
  }

  constructor(value: number | NumberValueObject) {
    assert(
      Longitude.isValid(value),
      new InvalidLongitudeError(value.valueOf()),
    );
    super(value.valueOf());
  }
}
