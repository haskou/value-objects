---
title: Integer
description: Whole-number value object.
---

# `Integer`

Whole-number value object.

## Import

```typescript
import { Integer } from '@haskou/value-objects';
```

## Signature

```typescript
class Integer extends NumberValueObject
```

## Constructor

```typescript
constructor(value: number | NumberValueObject)
```

## Validation

The value must be a number with no fractional part.

## Throws

This class can throw:

- `InvalidIntegerError`
- `InvalidNumberError`

## Example

```typescript
import { Integer } from '@haskou/value-objects';

const count = new Integer(42);
count.valueOf(); // 42
count.add(8).valueOf(); // 50
```

## Notes

- Arithmetic methods are inherited from `NumberValueObject`.
- Arithmetic results are returned through the base number behavior, not revalidated as `Integer` after every operation.

## Related

- [Error handling](/guides/error-handling)
- [Reference overview](/reference/)
