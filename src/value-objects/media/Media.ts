import { NullObject } from '../NullObject';
import { ValueObject } from '../ValueObject';

export class Media extends ValueObject<string> {
  constructor(value: string | Buffer) {
    super(value?.toString());

    if (NullObject.isNullObject(this)) {
      return this;
    }
  }

  public getBuffer(): Buffer {
    return Buffer.from(this.value);
  }

  public getSize(): number {
    return this.getBuffer().length;
  }

  public getBase64(): string {
    return this.getBuffer().toString('base64');
  }
}
