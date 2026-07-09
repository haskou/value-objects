---
title: NumberValueObject
description: Immutable number wrapper with comparison and arithmetic helpers.
---

# `NumberValueObject`

Immutable number wrapper with comparison and arithmetic helpers.

## Import

```typescript
import { NumberValueObject } from '@haskou/value-objects';
```

## Signature

```typescript
class NumberValueObject extends ValueObject<number>
```

## Constructor

```typescript
constructor(value: number | NumberValueObject)
```

## Validation

The value must not be `NaN`.

## Throws

This class can throw:

- `InvalidNumberError`

## Methods

| Method                        | Description                                                              |
| ----------------------------- | ------------------------------------------------------------------------ |
| `isZero()`                    | Returns true when the number is exactly 0.                               |
| `isGreaterThan(other)`        | Returns true when the current value is greater than `other`.             |
| `isGreaterOrEqualThan(other)` | Returns true when the current value is greater than or equal to `other`. |
| `isLessThan(other)`           | Returns true when the current value is less than `other`.                |
| `isLessOrEqualThan(other)`    | Returns true when the current value is less than or equal to `other`.    |
| `add(other)`                  | Returns a new `NumberValueObject` with the sum.                          |
| `subtract(other)`             | Returns a new `NumberValueObject` with the difference.                   |
| `multiply(other)`             | Returns a new `NumberValueObject` with the product.                      |
| `divide(other)`               | Returns a new `NumberValueObject` with the quotient.                     |

## Example

```typescript
import { NumberValueObject } from '@haskou/value-objects';

const a = new NumberValueObject(10);
const b = new NumberValueObject(5);

a.add(b).valueOf(); // 15
a.subtract(3).valueOf(); // 7
a.isGreaterThan(b); // true
```

## Notes

- Arithmetic helpers return new instances.
- `NaN`, `Infinity`, and `-Infinity` are rejected.

## Related

- [Error handling](/guides/error-handling)
- [Reference overview](/reference/)
