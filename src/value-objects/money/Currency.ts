import { InvalidFormatError } from '../../errors/InvalidFormatError';
import { assert } from '../../patterns/Assert';
import { Enum } from '../Enum';

export class Currency extends Enum<string> {
  private static readonly MINOR_UNIT_DIGITS: Record<string, number> = {
    AED: 2,
    ARS: 2,
    AUD: 2,
    BRL: 2,
    CAD: 2,
    CHF: 2,
    CLP: 0,
    CNY: 2,
    COP: 2,
    CRC: 2,
    CZK: 2,
    DKK: 2,
    EUR: 2,
    GBP: 2,
    HKD: 2,
    HUF: 2,
    IDR: 2,
    ILS: 2,
    INR: 2,
    ISK: 0,
    JPY: 0,
    KRW: 0,
    KWD: 3,
    MXN: 2,
    NOK: 2,
    NZD: 2,
    PEN: 2,
    PLN: 2,
    RON: 2,
    SEK: 2,
    SGD: 2,
    THB: 2,
    TRY: 2,
    USD: 2,
    ZAR: 2,
  };

  private static readonly SYMBOLS: Record<string, string> = {
    $: 'USD',
    '£': 'GBP',
    '¥': 'JPY',
    '₡': 'CRC',
    '₩': 'KRW',
    '₪': 'ILS',
    '€': 'EUR',
    '₹': 'INR',
    '₺': 'TRY',
  };

  public static fromSymbol(symbol: string): Currency {
    const code = Currency.SYMBOLS[symbol];
    assert(code, new InvalidFormatError(symbol));

    return new Currency(code);
  }

  public getValues(): string[] {
    return Object.keys(Currency.MINOR_UNIT_DIGITS);
  }

  public getMinorUnitDigits(): number {
    return Currency.MINOR_UNIT_DIGITS[this.valueOf()];
  }
}
