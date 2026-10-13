---
title: PositiveInteger
description: Integer value object constrained to non-negative values.
---

# `PositiveInteger`

Integer value object constrained to non-negative values.

## Import

```typescript
import { PositiveInteger } from '@haskou/value-objects';
```

## Signature

```typescript
class PositiveInteger extends Integer
```

## Constructor

```typescript
constructor(value: number | NumberValueObject)
```

## Validation

Accepts integers greater than or equal to `0`.

## Throws

This class can throw:

- `InvalidPositiveNumberError`
- `InvalidIntegerError`
- `InvalidNumberError`

## Example

```typescript
import { PositiveInteger } from '@haskou/value-objects';

const zero = new PositiveInteger(0);
const items = new PositiveInteger(3);

items.subtract(1).valueOf(); // 2
items.subtract(4); // throws InvalidPositiveNumberError
items.divide(2); // throws InvalidIntegerError
```

## Notes

- Like `PositiveNumber`, it accepts `0`.
- Arithmetic is inherited from `NumberValueObject` and goes through the constructor, so a result that is negative or not an integer throws.

## Related

- [`Integer`](/reference/integer)
- [`PositiveNumber`](/reference/positive-number)
- [Reference overview](/reference/)
