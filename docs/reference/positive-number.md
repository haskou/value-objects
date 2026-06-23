---
title: PositiveNumber
description: Number value object constrained to non-negative values.
---

# `PositiveNumber`

Number value object constrained to non-negative values.

## Import

```typescript
import { PositiveNumber } from '@haskou/value-objects';
```

## Signature

```typescript
class PositiveNumber extends NumberValueObject
```

## Constructor

```typescript
constructor(value: number | NumberValueObject)
```

## Validation

The current implementation accepts values greater than or equal to `0`.

## Throws

This class can throw:

- `InvalidPositiveNumberError`
- `InvalidNumberError`

## Example

```typescript
import { PositiveNumber } from '@haskou/value-objects';

const amount = new PositiveNumber(0);
const price = new PositiveNumber(19.99);

price.isGreaterThan(amount); // true
```

## Notes

- Despite the class name, the current implementation accepts `0`.
- Arithmetic methods are inherited from `NumberValueObject`.

## Related

- [Error handling](/guides/error-handling)
- [Reference overview](/reference/)
