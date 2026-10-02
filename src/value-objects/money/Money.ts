import { CurrencyMismatchError } from '../../errors/CurrencyMismatchError';
import { InvalidMoneyError } from '../../errors/InvalidMoneyError';
import { assert } from '../../patterns/Assert';
import { Integer } from '../Integer';
import { NullObject } from '../NullObject';
import { NumberValueObject } from '../NumberValueObject';
import { StringValueObject } from '../StringValueObject';
import { ValueObject } from '../ValueObject';
import { Currency } from './Currency';

export class Money extends ValueObject<string> {
  private static readonly FORMAT = /^(-?)(\d+)(?:\.(\d+))? ([A-Z]{3})$/;
  private static readonly TEXT_FORMAT =
    /^(-?)(?:([^\d\s.-]+)\s*)?(\d+(?:\.\d+)?)(?:\s*([^\d\s.-]+))?$/;

  private readonly currency!: Currency;
  private readonly minorUnits!: Integer;

  public static fromMinorUnits(
    minorUnits: number | NumberValueObject,
    currency: string | Currency,
  ): Money {
    const units = new Integer(minorUnits.valueOf());
    assert(Number.isSafeInteger(units.valueOf()), new InvalidMoneyError(units));

    const code = new Currency(currency.valueOf());
    const digits = code.getMinorUnitDigits();
    const padded = String(Math.abs(units.valueOf())).padStart(digits + 1, '0');
    const integer = padded.slice(0, padded.length - digits);
    const fraction =
      digits > 0 ? `.${padded.slice(padded.length - digits)}` : '';
    const sign = units.isLessThan(0) ? '-' : '';

    return new Money(`${sign}${integer}${fraction} ${code}`);
  }

  public static fromString(text: string): Money {
    const match = Money.TEXT_FORMAT.exec(text.trim());
    assert(match, new InvalidMoneyError(text));

    const [, sign, prefix, amount, suffix] = match;
    assert(!prefix !== !suffix, new InvalidMoneyError(text));

    const token = prefix ?? suffix;
    const currency = /^[A-Za-z]{3}$/.test(token)
      ? new Currency(token.toUpperCase())
      : Currency.fromSymbol(token);
    const [integer, fraction = ''] = amount.split('.');
    const digits = currency.getMinorUnitDigits();
    assert(fraction.length <= digits, new InvalidMoneyError(text));

    return Money.fromMinorUnits(
      Number(`${sign}${integer}${fraction.padEnd(digits, '0')}`),
      currency,
    );
  }

  constructor(value: string | StringValueObject) {
    super(value?.valueOf());

    if (NullObject.isNullObject(this)) {
      return this;
    }

    const match = Money.FORMAT.exec(this.value);
    assert(match, new InvalidMoneyError(this.value));

    const [, sign, integer, fraction = '', code] = match;
    const currency = new Currency(code);
    const minorUnits = new Integer(Number(`${sign}${integer}${fraction}`));

    assert(
      fraction.length === currency.getMinorUnitDigits() &&
        Number.isSafeInteger(minorUnits.valueOf()) &&
        !(sign && minorUnits.isZero()),
      new InvalidMoneyError(this.value),
    );

    Object.defineProperties(this, {
      currency: { enumerable: false, value: currency },
      minorUnits: { enumerable: false, value: minorUnits },
    });
  }

  private ensureSameCurrency(other: Money): void {
    assert(
      this.currency.isEqual(other.currency),
      new CurrencyMismatchError(
        this.currency.valueOf(),
        other.currency.valueOf(),
      ),
    );
  }

  public getCurrency(): Currency {
    return this.currency;
  }

  public getMinorUnits(): Integer {
    return this.minorUnits;
  }

  public isZero(): boolean {
    return this.minorUnits.isZero();
  }

  public isNegative(): boolean {
    return this.minorUnits.isLessThan(0);
  }

  public isGreaterThan(other: Money): boolean {
    this.ensureSameCurrency(other);

    return this.minorUnits.isGreaterThan(other.minorUnits);
  }

  public isLessThan(other: Money): boolean {
    this.ensureSameCurrency(other);

    return this.minorUnits.isLessThan(other.minorUnits);
  }

  public add(other: Money): Money {
    this.ensureSameCurrency(other);

    return Money.fromMinorUnits(
      this.minorUnits.add(other.minorUnits),
      this.currency,
    );
  }

  public subtract(other: Money): Money {
    this.ensureSameCurrency(other);

    return Money.fromMinorUnits(
      this.minorUnits.subtract(other.minorUnits),
      this.currency,
    );
  }

  public multiply(factor: number): Money {
    return Money.fromMinorUnits(
      Math.round(this.minorUnits.valueOf() * factor),
      this.currency,
    );
  }
}
