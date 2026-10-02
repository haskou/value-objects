import { NullObject } from '../NullObject';
import { StringValueObject } from '../StringValueObject';
import { ValueObject } from '../ValueObject';

export abstract class Hash extends ValueObject<string> {
  constructor(source: string | StringValueObject) {
    super(source?.valueOf());

    if (NullObject.isNullObject(this)) {
      return this;
    }
  }

  public toBase64(): StringValueObject {
    const bytes = Array.from(this.valueOf().matchAll(/../g), ([pair]) =>
      parseInt(pair, 16),
    );

    return new StringValueObject(btoa(String.fromCharCode(...bytes)));
  }
}
