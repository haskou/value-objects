import { Buffer } from 'buffer';

import { assert } from '../../patterns';

type StrictBase64Options = {
  allowEmpty?: boolean;
};

export class StrictBase64 {
  private static readonly PATTERN =
    /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;

  public static getDecodedLength(value: string): number {
    const padding = value.endsWith('==') ? 2 : value.endsWith('=') ? 1 : 0;

    return (value.length / 4) * 3 - padding;
  }

  public static ensure(
    value: string,
    error: Error,
    options: StrictBase64Options = {},
  ): void {
    assert(
      (options.allowEmpty === true || value.length > 0) &&
        value.length % 4 === 0 &&
        StrictBase64.PATTERN.test(value),
      error,
    );
  }

  public static ensureDecodedLength(
    value: string,
    error: Error,
    length: number,
    options: StrictBase64Options = {},
  ): void {
    assert(StrictBase64.getDecodedLength(value) === length, error);
    StrictBase64.ensure(value, error, options);
  }

  public static decode(
    value: string,
    error: Error,
    options: StrictBase64Options = {},
  ): Buffer {
    StrictBase64.ensure(value, error, options);

    return Buffer.from(value, 'base64');
  }

  public static decodeFixedLength(
    value: string,
    error: Error,
    length: number,
  ): Buffer {
    StrictBase64.ensureDecodedLength(value, error, length);

    return Buffer.from(value, 'base64');
  }

  public static decodeCanonicalFixedLength(
    value: string,
    error: Error,
    length: number,
  ): Buffer {
    const decoded = StrictBase64.decodeFixedLength(value, error, length);

    assert(decoded.toString('base64') === value, error);

    return decoded;
  }
}
