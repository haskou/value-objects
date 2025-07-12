import { ValueNotInEnumError } from '../errors/ValueNotInEnumError';
import { assert } from '../patterns/Assert';
import { NullObject } from '../patterns/NullObject';
import { ValueObject } from '../patterns/ValueObject';
import { Primitive } from '../types/Primitive';

export abstract class Enum<
  T extends Primitive = Primitive,
> extends ValueObject<T> {
  constructor(protected readonly value: T) {
    super(value);

    if (NullObject.isNullObject(this)) {
      return this;
    }

    this.ensureIsValidValue();
  }

  private ensureIsValidValue(): void {
    const isValueInEnum = this.getValues().some((enumValue) =>
      this.isEqual(enumValue),
    );
    assert(
      isValueInEnum,
      new ValueNotInEnumError(this.valueOf(), this.getValues()),
    );
  }

  public abstract getValues(): T[];
}
