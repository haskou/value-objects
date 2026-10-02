---
title: Currency
description: ISO 4217 currency code with its minor unit digits.
---

# `Currency`

ISO 4217 currency code with its minor unit digits.

## Import

```typescript
import { Currency } from '@haskou/value-objects';
```

## Signature

```typescript
class Currency extends Enum<string>
```

## Constructor

```typescript
constructor(value: string)
```

## Methods

| Method                      | Description                                                            |
| --------------------------- | ---------------------------------------------------------------------- |
| `static fromSymbol(symbol)` | Resolves `$` (USD), `£`, `¥` (JPY), `€`, `₡`, `₩`, `₪`, `₹` and `₺`.   |
| `getValues()`               | Returns the supported ISO codes.                                       |
| `getMinorUnitDigits()`      | Returns the decimals of the minor unit (`2` for `EUR`, `0` for `JPY`). |

## Throws

- `ValueNotInEnumError` for unsupported codes.
- `InvalidFormatError` for unknown symbols.

## Example

```typescript
import { Currency } from '@haskou/value-objects';

new Currency('JPY').getMinorUnitDigits(); // 0
Currency.fromSymbol('€').valueOf(); // 'EUR'
```

## Related

- [Money](/reference/money)
- [Reference overview](/reference/)
