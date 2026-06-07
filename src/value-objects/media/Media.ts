import { Buffer } from 'buffer';

import { NullObject } from '../NullObject';
import { ValueObject } from '../ValueObject';

export class Media extends ValueObject<string> {
  private readonly buffer?: Buffer;

  constructor(value: string | Buffer) {
    super(value?.toString());

    if (NullObject.isNullObject(this)) {
      return this;
    }

    this.buffer = Buffer.isBuffer(value) ? Buffer.from(value) : undefined;
  }

  public getBuffer(): Buffer {
    return this.buffer === undefined
      ? Buffer.from(this.value)
      : Buffer.from(this.buffer);
  }

  public getSize(): number {
    return this.getBuffer().length;
  }

  public getBase64(): string {
    return this.getBuffer().toString('base64');
  }

  public isEqual(other: unknown): boolean {
    if (other instanceof Media) {
      return this.getBuffer().equals(other.getBuffer());
    }

    if (Buffer.isBuffer(other)) {
      return this.getBuffer().equals(other);
    }

    return super.isEqual(other);
  }
}
