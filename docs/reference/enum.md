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
abstract class Enum<T extends Primitive = Primitive> extends ValueObject<T>
```

## Constructor

```typescript
constructor(value: T)
```

## Validation

The value must be included in the array returned by `getValues()`.

## Throws

This class can throw:

- `ValueNotInEnumError`

## Methods

| Method | Description |
| --- | --- |
| `getValues()` | Abstract method. Return all allowed primitive enum values. |

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

- Works with string, number, and mixed primitive enum values.

## Related

- [Error handling](/guides/error-handling)
- [Reference overview](/reference/)
