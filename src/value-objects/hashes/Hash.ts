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
    return new StringValueObject(
      Buffer.from(this.valueOf(), 'hex').toString('base64'),
    );
  }
}
