import { InvalidFormatError } from '../../errors/InvalidFormatError';
import { assert } from '../../patterns/Assert';
import { NumberValueObject } from '../NumberValueObject';
import { PositiveInteger } from '../PositiveInteger';
import { FileSizeUnit, FileSizeUnits } from './FileSizeUnit';

export interface HumanReadableFileSize {
  value: NumberValueObject;
  unit: FileSizeUnit;
}

export class FileSize extends PositiveInteger {
  private static readonly FORMAT = /^(\d+(?:\.\d+)?)\s*(\S+)$/;

  public static fromBytes<T extends FileSize = FileSize>(
    this: new (bytes: number | NumberValueObject) => T,
    bytes: number | NumberValueObject,
  ): T {
    return new this(bytes);
  }

  public static from<T extends FileSize = FileSize>(
    this: new (bytes: number | NumberValueObject) => T,
    value: number | NumberValueObject,
    unit: FileSizeUnit,
  ): T {
    return new this(Math.round(value.valueOf() * unit.getBytes().valueOf()));
  }

  public static parse<T extends FileSize = FileSize>(
    this: new (bytes: number | NumberValueObject) => T,
    text: string,
  ): T {
    const match = FileSize.FORMAT.exec(text.trim());

    assert(match, new InvalidFormatError(text));

    const [, value, symbol] = match;
    const unit = new FileSizeUnit(symbol);

    return new this(Math.round(Number(value) * unit.getBytes().valueOf()));
  }

  public toBytes(): PositiveInteger {
    return new PositiveInteger(this.value);
  }

  public to(unit: FileSizeUnit): NumberValueObject {
    return new NumberValueObject(this.value / unit.getBytes().valueOf());
  }

  public toHumanReadable(units: FileSizeUnits): HumanReadableFileSize {
    const [smallest, ...rest] = [...units].sort((a, b) =>
      a.getBytes().isLessThan(b.getBytes()) ? -1 : 1,
    );
    const unit = rest.reduce(
      (fitting, candidate) =>
        this.isGreaterOrEqualThan(candidate.getBytes()) ? candidate : fitting,
      smallest,
    );

    return { unit, value: this.to(unit) };
  }
}
