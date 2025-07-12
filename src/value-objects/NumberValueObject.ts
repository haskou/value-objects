import { InvalidNumberError } from '../errors/InvalidNumberError';
import { assert } from '../patterns/Assert';
import { NullObject } from '../patterns/NullObject';
import { ValueObject } from '../patterns/ValueObject';

export class NumberValueObject extends ValueObject<number> {
  constructor(value: number | NumberValueObject) {
    super(value?.valueOf());

    if (NullObject.isNullObject(this)) {
      return this;
    }

    assert(this.isValidNumber(this.value), new InvalidNumberError(this.value));
  }

  private isValidNumber(value: number): boolean {
    return !isNaN(value.valueOf());
  }

  public isZero(): boolean {
    return this.value === 0;
  }

  public isGreaterThan(other: number | NumberValueObject): boolean {
    return this.value > other.valueOf();
  }

  public isGreaterOrEqualThan(other: number | NumberValueObject): boolean {
    return this.value >= other.valueOf();
  }

  public isLessThan(other: number | NumberValueObject): boolean {
    return this.value < other.valueOf();
  }

  public isLessOrEqualThan(other: number | NumberValueObject): boolean {
    return this.value <= other.valueOf();
  }

  public add(other: number | NumberValueObject): NumberValueObject {
    return this.clone(this.value + other.valueOf());
  }

  public subtract(other: number | NumberValueObject): NumberValueObject {
    return this.clone(this.value - other.valueOf());
  }

  public multiply(other: number | NumberValueObject): NumberValueObject {
    return this.clone(this.value * other.valueOf());
  }

  public divide(other: number | NumberValueObject): NumberValueObject {
    return this.clone(this.value / other.valueOf());
  }
}
