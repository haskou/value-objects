import {
  Currency,
  InvalidFormatError,
  NullObject,
  ValueNotInEnumError,
} from '../../../src';

describe('Currency', () => {
  it('should return a NullObject when a Nullish is received', () => {
    expect(NullObject.isNullObject(new Currency(null as never))).toBeTrue();
  });

  it('should accept ISO codes and reject unknown ones', () => {
    expect(new Currency('EUR').valueOf()).toBe('EUR');
    expect(() => new Currency('XXX')).toThrow(ValueNotInEnumError);
  });

  it.each([
    ['EUR', 2],
    ['USD', 2],
    ['JPY', 0],
    ['CLP', 0],
    ['CRC', 2],
  ])('should expose the minor unit digits of %s', (code, digits) => {
    expect(new Currency(code).getMinorUnitDigits()).toBe(digits);
  });

  it('should list its supported codes', () => {
    expect(new Currency('EUR').getValues()).toEqual(
      expect.arrayContaining(['EUR', 'USD', 'JPY']),
    );
  });

  it.each([
    ['€', 'EUR'],
    ['$', 'USD'],
    ['£', 'GBP'],
    ['¥', 'JPY'],
    ['₡', 'CRC'],
  ])('should resolve the symbol %s to %s', (symbol, code) => {
    expect(Currency.fromSymbol(symbol).valueOf()).toBe(code);
  });

  it('should reject unknown symbols', () => {
    expect(() => Currency.fromSymbol('#')).toThrow(InvalidFormatError);
  });
});
