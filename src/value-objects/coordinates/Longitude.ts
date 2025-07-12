import { InvalidLongitudeError } from '../../errors/InvalidLongitudeError';
import { assert } from '../../patterns/Assert';
import { NumberValueObject } from '../NumberValueObject';

export class Longitude extends NumberValueObject {
  private static MIN_VALUE = new NumberValueObject(-180);
  private static MAX_VALUE = new NumberValueObject(180);

  private static isValid(value: number | NumberValueObject): boolean {
    const numberValue = new NumberValueObject(value.valueOf());

    return (
      numberValue.isGreaterOrEqualThan(this.MIN_VALUE) &&
      numberValue.isLessOrEqualThan(this.MAX_VALUE)
    );
  }

  constructor(value: number | NumberValueObject) {
    super(value.valueOf());
    assert(
      Longitude.isValid(value),
      new InvalidLongitudeError(value.valueOf()),
    );
  }
}
