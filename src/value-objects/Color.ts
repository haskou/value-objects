import { InvalidColorError } from '../errors/InvalidColorError';
import { assert } from '../patterns/Assert';
import { NullObject } from '../patterns/NullObject';
import { StringValueObject } from './StringValueObject';

export class Color extends StringValueObject {
  public static readonly RED = new Color('#FF0000');
  public static readonly GREEN = new Color('#00FF00');
  public static readonly BLUE = new Color('#0000FF');
  public static readonly BLACK = new Color('#000000');
  public static readonly WHITE = new Color('#FFFFFF');
  public static readonly YELLOW = new Color('#FFFF00');
  public static readonly CYAN = new Color('#00FFFF');
  public static readonly MAGENTA = new Color('#FF00FF');
  public static readonly ORANGE = new Color('#FFA500');
  public static readonly PURPLE = new Color('#800080');
  public static readonly PINK = new Color('#FFC0CB');
  public static readonly BROWN = new Color('#A52A2A');

  constructor(value: string | StringValueObject) {
    super(value?.valueOf());

    if (NullObject.isNullObject(this)) {
      return this;
    }

    this.ensureIsValidColor();
  }

  private ensureIsValidColor(): void {
    const hexColorPattern = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

    assert(hexColorPattern.test(this.value), new InvalidColorError(this.value));
  }

  public isEqual(other: Color): boolean {
    return this.value.toLowerCase() === other?.toString().toLowerCase();
  }
}
