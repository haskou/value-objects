---
title: NullObject
description: Factory and detector for null object instances.
---

# `NullObject`

Factory and detector for null object instances.

## Import

```typescript
import { NullObject } from '@haskou/value-objects';
```

## Signature

```typescript
abstract class NullObject
```

## Constructor

```typescript
Not constructed directly.
```

## Validation

`NullObject.new()` creates an object with `isNullObject: true`, `valueOf(): undefined`, and fake methods that throw `NullObjectError`.

## Methods

| Method | Description |
| --- | --- |
| `static new(klass)` | Creates a null object compatible with the requested class. |
| `static isNullObject(value)` | Returns true when the value looks like a null object. |

## Example

```typescript
import { NullObject, StringValueObject } from '@haskou/value-objects';

const value = new StringValueObject(undefined as never);

NullObject.isNullObject(value); // true
value.valueOf(); // undefined
```

## Notes

- Calling most class methods on a null object throws `NullObjectError`.
- This is useful when nullish construction should be represented consistently.

## Related

- [Error handling](/guides/error-handling)
- [Reference overview](/reference/)
