import { ValueNotInEnumError } from '../errors/ValueNotInEnumError';
import { assert } from '../patterns/Assert';
import { Primitive } from '../types';
import { NullObject } from './NullObject';
import { ValueObject } from './ValueObject';

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
