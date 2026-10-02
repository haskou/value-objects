import { NullObject } from '../NullObject';
import { ValueObject } from '../ValueObject';

export class Media extends ValueObject<string> {
  private static readonly BASE64_CHUNK_SIZE = 0x8000;

  private readonly buffer?: Uint8Array;

  constructor(value: string | Uint8Array) {
    super(
      value instanceof Uint8Array
        ? new TextDecoder('utf-8', { ignoreBOM: true }).decode(value)
        : value,
    );

    if (NullObject.isNullObject(this)) {
      return this;
    }

    this.buffer =
      value instanceof Uint8Array ? new Uint8Array(value) : undefined;
  }

  public getBuffer(): Uint8Array {
    return this.buffer === undefined
      ? new TextEncoder().encode(this.value)
      : new Uint8Array(this.buffer);
  }

  public getSize(): number {
    return this.getBuffer().length;
  }

  public getBase64(): string {
    const bytes = this.getBuffer();
    const chunks: string[] = [];

    // Chunked so large payloads do not overflow the call stack.
    for (let i = 0; i < bytes.length; i += Media.BASE64_CHUNK_SIZE) {
      chunks.push(
        String.fromCharCode(...bytes.subarray(i, i + Media.BASE64_CHUNK_SIZE)),
      );
    }

    return btoa(chunks.join(''));
  }

  public hasValue(other: unknown): boolean {
    let otherBytes: Uint8Array | undefined;

    if (other instanceof Media) {
      otherBytes = other.getBuffer();
    } else if (other instanceof Uint8Array) {
      otherBytes = other;
    }

    if (otherBytes === undefined) {
      return super.hasValue(other);
    }

    const bytes = this.getBuffer();

    return (
      bytes.length === otherBytes.length &&
      bytes.every((byte, i) => byte === otherBytes[i])
    );
  }
}
