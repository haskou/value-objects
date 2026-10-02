---
title: Money
description: Exact monetary amount with currency, stored as integer minor units.
---

# `Money`

Exact monetary amount with currency. The amount is held as an integer number of minor units (cents), so arithmetic never accumulates floating point errors.

## Import

```typescript
import { Money } from '@haskou/value-objects';
```

## Signature

```typescript
class Money extends ValueObject<string>
```

The canonical value is `"<amount> <ISO code>"`, for example `"19.99 EUR"` or `"1500 JPY"`.

## Constructor

```typescript
constructor(value: string | StringValueObject)
```

The constructor is strict: the number of decimals must equal the currency's minor unit digits (`19.99 EUR`, `1500 JPY`), and `-0.00` is rejected. Use `fromString()` for lenient input.

## Methods

| Method                                   | Description                                                                        |
| ---------------------------------------- | ---------------------------------------------------------------------------------- |
| `static fromMinorUnits(units, currency)` | Builds from an integer amount of minor units and a currency code or `Currency`.    |
| `static fromString(text)`                | Parses `20€`, `€20`, `20 €`, `$19.5`, `-€3.07`, `20.50 EUR`, `EUR 20` or `20 eur`. |
| `getCurrency()`                          | Returns the `Currency`.                                                            |
| `getMinorUnits()`                        | Returns the amount in minor units as an `Integer`.                                 |
| `isZero()`                               | True when the amount is zero.                                                      |
| `isNegative()`                           | True when the amount is below zero.                                                |
| `isGreaterThan(other)`                   | Compares amounts of the same currency.                                             |
| `isLessThan(other)`                      | Compares amounts of the same currency.                                             |
| `add(other)`                             | Returns the sum as a new `Money`.                                                  |
| `subtract(other)`                        | Returns the difference as a new `Money`.                                           |
| `multiply(factor)`                       | Returns the product rounded to the nearest minor unit.                             |

## Throws

- `InvalidMoneyError` for malformed text, too many decimals, missing or duplicated currency, or amounts beyond ±2^53 minor units.
- `CurrencyMismatchError` when operating on two different currencies.
- `ValueNotInEnumError` for unsupported ISO codes.
- `InvalidFormatError` for unknown currency symbols.

## Example

```typescript
import { Money } from '@haskou/value-objects';

const price = Money.fromString('19.99 EUR');

price.multiply(3).valueOf(); // '59.97 EUR'
Money.fromString('0.10 EUR').add(Money.fromString('0.20 EUR')).valueOf(); // '0.30 EUR'
Money.fromMinorUnits(1500, 'JPY').valueOf(); // '1500 JPY'
```

## Notes

- Symbols `$` and `¥` resolve to `USD` and `JPY`; use ISO codes (`20 CAD`) for any other dollar or yen currency.
- Locale separators (`1,50`) are rejected.
- Allocation, `>=`/`<=`, `negate`, `abs` and locale formatting are not provided.

## Related

- [Currency](/reference/currency)
- [Error handling](/guides/error-handling)
- [Reference overview](/reference/)
