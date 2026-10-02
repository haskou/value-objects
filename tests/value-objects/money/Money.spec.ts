import {
  CurrencyMismatchError,
  Integer,
  InvalidFormatError,
  InvalidMoneyError,
  Money,
  NullObject,
  NullObjectError,
  ValueNotInEnumError,
} from '../../../src';

describe('Money', () => {
  describe('constructor', () => {
    it('should return a NullObject when a Nullish is received', () => {
      const money = new Money(null as never);

      expect(NullObject.isNullObject(money)).toBeTrue();
      expect(() => money.add(money)).toThrow(NullObjectError);
    });

    it.each(['19.99 EUR', '0.00 USD', '-3.07 EUR', '1500 JPY'])(
      'should accept %s',
      (text) => {
        expect(new Money(text).valueOf()).toBe(text);
      },
    );

    it.each([
      '19.9 EUR',
      '19.999 EUR',
      '1500.0 JPY',
      '19.99',
      '19.99EUR',
      '19.99 eur',
      '-0.00 EUR',
      '9007199254740993.00 EUR',
      '',
    ])('should reject %p', (text) => {
      expect(() => new Money(text)).toThrow(InvalidMoneyError);
    });

    it('should reject unknown currencies', () => {
      expect(() => new Money('1.00 ZZZ')).toThrow(ValueNotInEnumError);
    });

    it('should only store the canonical value', () => {
      expect(Object.keys(new Money('19.99 EUR'))).toEqual(['value']);
    });
  });

  describe('fromMinorUnits', () => {
    it.each([
      [1999, 'EUR', '19.99 EUR'],
      [5, 'EUR', '0.05 EUR'],
      [0, 'EUR', '0.00 EUR'],
      [-307, 'EUR', '-3.07 EUR'],
      [-5, 'USD', '-0.05 USD'],
      [1500, 'JPY', '1500 JPY'],
    ])('should build %p %s as %s', (units, currency, expected) => {
      expect(Money.fromMinorUnits(units, currency).valueOf()).toBe(expected);
    });

    it('should accept value objects', () => {
      expect(Money.fromMinorUnits(new Integer(100), 'EUR').valueOf()).toBe(
        '1.00 EUR',
      );
    });

    it('should reject non integer and unsafe amounts', () => {
      expect(() => Money.fromMinorUnits(1.5, 'EUR')).toThrow();
      expect(() => Money.fromMinorUnits(2 ** 53, 'EUR')).toThrow(
        InvalidMoneyError,
      );
    });
  });

  describe('fromString', () => {
    it.each([
      ['20€', '20.00 EUR'],
      ['€20', '20.00 EUR'],
      ['20 €', '20.00 EUR'],
      ['$19.5', '19.50 USD'],
      ['-€3.07', '-3.07 EUR'],
      ['20.50 EUR', '20.50 EUR'],
      ['EUR 20', '20.00 EUR'],
      ['20 eur', '20.00 EUR'],
      ['1500¥', '1500 JPY'],
      ['  £7 ', '7.00 GBP'],
      ['₡20', '20.00 CRC'],
    ])('should parse %p as %s', (text, expected) => {
      expect(Money.fromString(text).valueOf()).toBe(expected);
    });

    it.each([
      '20',
      '€',
      '€20€',
      '€20 EUR',
      '19.999 EUR',
      '1.5 JPY',
      '1,50 EUR',
      '',
    ])('should reject %p', (text) => {
      expect(() => Money.fromString(text)).toThrow(InvalidMoneyError);
    });

    it('should reject unknown symbols', () => {
      expect(() => Money.fromString('#20')).toThrow(InvalidFormatError);
    });
  });

  describe('accessors', () => {
    const money = Money.fromString('19.99 EUR');

    it('should expose currency and minor units', () => {
      expect(money.getCurrency().valueOf()).toBe('EUR');
      expect(money.getMinorUnits()).toBeInstanceOf(Integer);
      expect(money.getMinorUnits().valueOf()).toBe(1999);
    });

    it('should detect zero and negative amounts', () => {
      expect(Money.fromString('0 EUR').isZero()).toBeTrue();
      expect(money.isZero()).toBeFalse();
      expect(Money.fromString('-1 EUR').isNegative()).toBeTrue();
      expect(money.isNegative()).toBeFalse();
    });
  });

  describe('arithmetic', () => {
    it('should add without floating point errors', () => {
      expect(
        Money.fromString('0.10 EUR')
          .add(Money.fromString('0.20 EUR'))
          .valueOf(),
      ).toBe('0.30 EUR');
    });

    it('should subtract into negative amounts', () => {
      expect(
        Money.fromString('0.20 EUR')
          .subtract(Money.fromString('0.50 EUR'))
          .valueOf(),
      ).toBe('-0.30 EUR');
    });

    it('should multiply and round to the minor unit', () => {
      expect(Money.fromString('19.99 EUR').multiply(3).valueOf()).toBe(
        '59.97 EUR',
      );
      expect(Money.fromString('0.05 EUR').multiply(0.5).valueOf()).toBe(
        '0.03 EUR',
      );
    });

    it('should not mutate operands', () => {
      const money = Money.fromString('1.00 EUR');

      money.add(money);

      expect(money.valueOf()).toBe('1.00 EUR');
    });
  });

  describe('comparison', () => {
    const small = Money.fromString('1.00 EUR');
    const big = Money.fromString('2.00 EUR');

    it('should compare amounts of the same currency', () => {
      expect(big.isGreaterThan(small)).toBeTrue();
      expect(small.isGreaterThan(big)).toBeFalse();
      expect(small.isLessThan(big)).toBeTrue();
      expect(big.isLessThan(small)).toBeFalse();
    });

    it('should be equal by amount and currency', () => {
      expect(small.isEqual(Money.fromString('1 EUR'))).toBeTrue();
      expect(small.isEqual(Money.fromString('1 USD'))).toBeFalse();
    });
  });

  describe('currency mismatch', () => {
    const eur = Money.fromString('1 EUR');
    const usd = Money.fromString('1 USD');

    it.each([
      ['add', () => eur.add(usd)],
      ['subtract', () => eur.subtract(usd)],
      ['isGreaterThan', () => eur.isGreaterThan(usd)],
      ['isLessThan', () => eur.isLessThan(usd)],
    ])('should throw on %s', (_name, operation) => {
      expect(operation).toThrow(CurrencyMismatchError);
    });
  });
});
