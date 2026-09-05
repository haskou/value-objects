import { Primitive, Nullish } from '../types';
import { NullObject } from './NullObject';

export abstract class ValueObject<T extends Primitive = Primitive> {
  protected readonly value!: T;

  constructor(value: T | Nullish) {
    if (this.isNullish(value)) {
      return NullObject.new(new.target);
    }
    this.value = value;
  }

  private isNullish(value: T | Nullish): value is null | undefined {
    return value === null || value === undefined;
  }

  protected clone(value: T): this {
    return new (this.constructor as new (value: Primitive) => this)(
      this.isNullish(value) ? this.value : value,
    ) as this;
  }

  public hasValue(other: unknown): boolean {
    const otherValue = other instanceof ValueObject ? other.valueOf() : other;

    return this.value === otherValue;
  }

  public isEqual(other: unknown): boolean {
    return (
      other instanceof ValueObject &&
      this.constructor === other.constructor &&
      this.hasValue(other)
    );
  }

  public isNotEqual(other: unknown): boolean {
    return this.isEqual(other) === false;
  }

  public valueOf(): T {
    return this.value;
  }

  public toString(): string {
    return this.value!.toString();
  }
}
