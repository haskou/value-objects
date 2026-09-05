---
title: Enum
description: Abstract base class for enum-backed value objects.
---

# `Enum`

Abstract base class for enum-backed value objects.

## Import

```typescript
import { Enum } from '@haskou/value-objects';
```

## Signature

```typescript
abstract class Enum<T extends Scalar = Scalar> extends ValueObject<T>
```

## Constructor

```typescript
constructor(value: T)
```

## Validation

The scalar value must be included in the array returned by `getValues()`.

## Throws

This class can throw:

- `ValueNotInEnumError`

## Methods

| Method | Description |
| --- | --- |
| `getValues()` | Abstract method. Return all allowed scalar enum values. |

## Example

```typescript
import { Enum } from '@haskou/value-objects';

enum Status {
  ACTIVE = 'active',
  DISABLED = 'disabled',
}

class StatusValue extends Enum<string> {
  public getValues(): string[] {
    return Object.values(Status);
  }
}

new StatusValue(Status.ACTIVE).valueOf(); // 'active'
```

## Notes

- Works with string, number, boolean, bigint, and symbol enum-like values.
- Object and array values are intentionally excluded because the base equality contract is scalar.

## Related

- [Error handling](/guides/error-handling)
- [Reference overview](/reference/)
