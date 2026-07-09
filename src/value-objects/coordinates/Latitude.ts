import { InvalidLatitudeError } from '../../errors/InvalidLatitudeError';
import { assert } from '../../patterns/Assert';
import { NumberValueObject } from '../NumberValueObject';

export class Latitude extends NumberValueObject {
  private static MIN_VALUE = new NumberValueObject(-90);
  private static MAX_VALUE = new NumberValueObject(90);

  private static isValid(value: number | NumberValueObject): boolean {
    const primitive = value.valueOf();

    return (
      Number.isFinite(primitive) &&
      primitive >= this.MIN_VALUE.valueOf() &&
      primitive <= this.MAX_VALUE.valueOf()
    );
  }

  constructor(value: number | NumberValueObject) {
    assert(Latitude.isValid(value), new InvalidLatitudeError(value.valueOf()));
    super(value.valueOf());
  }
}
