import { InvalidLatitudeError } from '../../errors/InvalidLatitudeError';
import { assert } from '../../patterns/Assert';
import { NumberValueObject } from '../NumberValueObject';

export class Latitude extends NumberValueObject {
  private static MIN_VALUE = new NumberValueObject(-90);
  private static MAX_VALUE = new NumberValueObject(90);

  private static isValid(value: number | NumberValueObject): boolean {
    const numberValue = new NumberValueObject(value.valueOf());

    return (
      numberValue.isGreaterOrEqualThan(this.MIN_VALUE) &&
      numberValue.isLessOrEqualThan(this.MAX_VALUE)
    );
  }

  constructor(value: number | NumberValueObject) {
    super(value.valueOf());
    assert(Latitude.isValid(value), new InvalidLatitudeError(value.valueOf()));
  }
}
